import "server-only";
import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Admin authentication.
 *
 * Deliberately small: one cookie holding a 256-bit random token, and a
 * `sessions` row keyed on the SHA-256 of that token. No JWT, no auth
 * dependency — this guards a single-tenant CMS, and every extra moving part
 * is another thing that can be wrong.
 *
 * The security-relevant choices are not the lazy ones:
 *  - scrypt for password hashing (memory-hard; a bare SHA is not acceptable
 *    for passwords), with a per-user random salt
 *  - `timingSafeEqual` for both password and token comparison
 *  - only the token's hash is stored, so a database dump cannot be replayed
 *    as a live session
 *  - the cookie is httpOnly + sameSite=lax + secure in production
 */

const sql = neon(process.env.DATABASE_URL!);
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number
) => Promise<Buffer>;

const COOKIE = "jetage_admin_session";
const SESSION_DAYS = 7;

export type AdminUser = { id: number; email: string; name: string };

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await scryptAsync(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, keyHex] = stored.split(":");
  if (!salt || !keyHex) return false;

  const expected = Buffer.from(keyHex, "hex");
  const actual = await scryptAsync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/**
 * Verifies credentials and starts a session. Returns null on failure — the
 * caller shows one generic message either way, so the form never reveals
 * whether an email exists.
 */
export async function signIn(email: string, password: string): Promise<AdminUser | null> {
  const rows = (await sql`
    select id, email, name, password_hash from admin_users where email = ${email.toLowerCase().trim()}
  `) as { id: number; email: string; name: string; password_hash: string }[];

  const user = rows[0];
  if (!user) {
    // Hash anyway so a missing account is not measurably faster than a wrong
    // password, which would otherwise enumerate valid emails.
    await scryptAsync(password, "decoy", 64);
    return null;
  }

  if (!(await verifyPassword(password, user.password_hash))) return null;

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await sql`
    insert into sessions (token_hash, user_id, expires_at)
    values (${hashToken(token)}, ${user.id}, ${expires.toISOString()})
  `;

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });

  return { id: user.id, email: user.email, name: user.name };
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const rows = (await sql`
    select u.id, u.email, u.name
    from sessions s
    join admin_users u on u.id = s.user_id
    where s.token_hash = ${hashToken(token)} and s.expires_at > now()
    limit 1
  `) as AdminUser[];

  return rows[0] ?? null;
}

export async function signOut() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await sql`delete from sessions where token_hash = ${hashToken(token)}`;
  store.delete(COOKIE);
}

export async function changePassword(userId: number, current: string, next: string) {
  const rows = (await sql`
    select password_hash from admin_users where id = ${userId}
  `) as { password_hash: string }[];

  if (!rows[0] || !(await verifyPassword(current, rows[0].password_hash))) {
    return { ok: false as const, error: "Current password is incorrect." };
  }
  if (next.length < 12) {
    return { ok: false as const, error: "New password must be at least 12 characters." };
  }

  await sql`update admin_users set password_hash = ${await hashPassword(next)} where id = ${userId}`;
  // Every other session belonging to this user is now stale.
  await sql`delete from sessions where user_id = ${userId}`;
  return { ok: true as const };
}

/** Best-effort cleanup of expired rows; called opportunistically on sign-in pages. */
export async function pruneSessions() {
  await sql`delete from sessions where expires_at < now()`;
}
