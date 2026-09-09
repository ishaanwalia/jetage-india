import "server-only";
import nodemailer from "nodemailer";

/**
 * Outbound email, one transport for the whole site.
 *
 * Hostinger, not Gmail. The mailbox is already paid for, it is
 * `info@jetageindia.in` so SPF/DKIM align with the sending domain, and it has
 * no daily send cap worth worrying about at this volume. Gmail SMTP would need
 * an App Password, caps at ~500/day, and stamps "on behalf of" on mail whose
 * From address it does not own — which is exactly the wrong signal on an order
 * confirmation carrying a payment amount.
 *
 * Every caller gets the same deliberate failure mode: if the password is not
 * configured, sending returns false rather than throwing. A missing mailbox
 * password must never lose a paid order.
 */

export const MAILBOX = "info@jetageindia.in";

/** Where counter staff read enquiries and order notifications. */
export const INTERNAL_RECIPIENTS = [MAILBOX, "ishaan.walia.148@gmail.com"];

export const mailConfigured = () => Boolean(process.env.HOSTINGER_EMAIL_PASSWORD);

/**
 * One transport, reused.
 *
 * A confirmed order sends two messages — the buyer's and the counter's — and
 * building a transport per message meant two TLS handshakes to Hostinger
 * instead of one connection carrying both.
 */
let transporter: nodemailer.Transporter | null = null;
function getTransport(pass: string) {
  transporter ??= nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    // 465 is implicit TLS. 587 would need secure:false and STARTTLS instead,
    // and getting that pair backwards is the usual reason SMTP works locally
    // and not in production.
    secure: true,
    auth: { user: MAILBOX, pass },
  });
  return transporter;
}

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  from?: string;
  /** Which message this is, for the log. */
  template?: string;
}): Promise<boolean> {
  const pass = process.env.HOSTINGER_EMAIL_PASSWORD;
  if (!pass) {
    // Deliberately logs the subject and not the body: order mail carries a
    // name, a phone number and a delivery address, and Vercel's request logs
    // are retained on Vercel's schedule rather than ours.
    console.error(`Mail: HOSTINGER_EMAIL_PASSWORD not set — "${opts.subject}" was not delivered.`);
    await logMail(opts, false, "HOSTINGER_EMAIL_PASSWORD not set");
    return false;
  }

  try {
    await getTransport(pass).sendMail({
      from: opts.from ?? `Jetage India <${MAILBOX}>`,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      replyTo: opts.replyTo,
    });
  } catch (err) {
    console.error(`Mail: Hostinger SMTP send failed for "${opts.subject}"`, err);
    await logMail(opts, false, err instanceof Error ? err.message : "send failed");
    return false;
  }

  await logMail(opts, true);
  return true;
}

/**
 * Record every attempt, delivered or not.
 *
 * "Did the buyer actually get their confirmation?" had no answer here except
 * Vercel's request log, which is retained on Vercel's schedule rather than ours
 * and is gone by the time a customer rings to ask. Now it is a row.
 *
 * Never throws. A logging failure must not turn a delivered email into a failed
 * one, and must certainly not fail the order the mail was about — the log is
 * evidence, not part of the transaction. Recipient and subject only; the body
 * is the part carrying the address and the phone number.
 */
async function logMail(
  opts: { to: string | string[]; subject: string; template?: string },
  sent: boolean,
  error?: string,
) {
  try {
    // Imported here rather than at the top so this module stays usable from a
    // context with no database — the send path must not depend on the log.
    const { neon } = await import("@neondatabase/serverless");
    if (!process.env.DATABASE_URL) return;
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO mail_log (recipient, subject, template, sent, error)
      VALUES (${[opts.to].flat().join(", ")}, ${opts.subject},
              ${opts.template ?? null}, ${sent}, ${error ?? null})
    `;
  } catch (err) {
    console.error("Mail: could not write the log entry", err);
  }
}
