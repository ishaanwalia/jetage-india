import "server-only";
import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

/**
 * Rate limiting, in the database.
 *
 * Not an in-memory Map: this runs on serverless, several instances are warm at
 * once, each has its own memory, and a limit that can be bypassed by arriving
 * at a different instance is not a limit.
 *
 * Keys are hashed. These counters exist to prevent abuse and should not
 * quietly become a second list of everyone who has used the site — so nothing
 * here is reversible back to an email address.
 *
 * ponytail: one row per key with a fixed window, so a burst can straddle a
 * window boundary and get up to 2× the limit. Fine for stopping runaway cost
 * and inbox spam; reach for a sliding window only if something actually abuses
 * the seam.
 */

const sql = neon(process.env.DATABASE_URL!);

/**
 * Counts one use against `key` and says whether it is allowed.
 *
 * A single statement, so two simultaneous requests cannot both read the same
 * count and both decide they are under the limit.
 */
export async function allow(key: string, windowMinutes: number, max: number): Promise<boolean> {
  const hash = createHash("sha256").update(key).digest("hex");
  const rows = (await sql`
    INSERT INTO rate_limit (key_hash, window_start, count)
    VALUES (${hash}, now(), 1)
    ON CONFLICT (key_hash) DO UPDATE SET
      -- Expired window: start a fresh one at 1. Otherwise increment in place.
      count = CASE
        WHEN rate_limit.window_start < now() - (${windowMinutes} || ' minutes')::interval
        THEN 1 ELSE rate_limit.count + 1 END,
      window_start = CASE
        WHEN rate_limit.window_start < now() - (${windowMinutes} || ' minutes')::interval
        THEN now() ELSE rate_limit.window_start END
    RETURNING count
  `) as { count: number }[];

  return Number(rows[0]?.count ?? 0) <= max;
}
