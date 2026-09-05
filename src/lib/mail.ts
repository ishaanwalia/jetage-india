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

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  from?: string;
}): Promise<boolean> {
  const pass = process.env.HOSTINGER_EMAIL_PASSWORD;
  if (!pass) {
    // Deliberately logs the subject and not the body: order mail carries a
    // name, a phone number and a delivery address, and Vercel's request logs
    // are retained on Vercel's schedule rather than ours.
    console.error(`Mail: HOSTINGER_EMAIL_PASSWORD not set — "${opts.subject}" was not delivered.`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: { user: MAILBOX, pass },
    });
    await transporter.sendMail({
      from: opts.from ?? `Jetage India <${MAILBOX}>`,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return true;
  } catch (err) {
    console.error(`Mail: Hostinger SMTP send failed for "${opts.subject}"`, err);
    return false;
  }
}
