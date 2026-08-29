import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { LeadNotification } from "@/emails/LeadNotification";

const HOSTINGER_MAILBOX = "info@jetageindia.in";
const PERSONAL_EMAIL_TO = "ishaan.walia.148@gmail.com";

interface LeadPayload {
  name: string;
  phone: string;
  interest?: string;
  message?: string;
  source: string;
  consentGiven?: string;
  consentNoticeVersion?: string;
  consentAt?: string;
}

function isLeadPayload(value: unknown): value is LeadPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === "string" && typeof v.phone === "string" && typeof v.source === "string";
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!isLeadPayload(body)) {
    return NextResponse.json({ ok: false, error: "Invalid lead payload" }, { status: 400 });
  }

  const mailboxPassword = process.env.HOSTINGER_EMAIL_PASSWORD;
  if (!mailboxPassword) {
    // Not configured yet — don't break the page, just leave a trace in the
    // server logs so this is easy to notice once the env var is set.
    // Deliberately does NOT log `body`. It holds a name, a phone number and
    // free text, and Vercel's request logs are retained on Vercel's schedule
    // rather than ours — writing PII there quietly creates a second copy that
    // nothing tracks and nothing deletes. The source is enough to find the
    // form; losing the lead itself is the correct trade.
    console.error(
      `Lead capture: HOSTINGER_EMAIL_PASSWORD not set — an enquiry from "${body.source}" was not delivered.`,
    );
    return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 202 });
  }

  const { name, phone, interest, message, source, consentGiven, consentNoticeVersion, consentAt } =
    body;
  const time = `${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`;
  const text = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    interest ? `Interested in: ${interest}` : null,
    message ? `Notes: ${message}` : null,
    `Source: ${source}`,
    `Time: ${time}`,
    // The evidence half of consent: what this person was shown, and when they
    // agreed. Kept with the enquiry because that is where it will still be if
    // anyone ever asks.
    consentGiven ? `
Consent given: "${consentGiven}"` : null,
    consentNoticeVersion ? `Consent notice version: ${consentNoticeVersion}` : null,
    consentAt ? `Consent timestamp: ${consentAt}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const html = await render(
    <LeadNotification name={name} phone={phone} interest={interest} message={message} source={source} time={time} />
  );

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: { user: HOSTINGER_MAILBOX, pass: mailboxPassword },
    });
    await transporter.sendMail({
      from: `Jetage Leads <${HOSTINGER_MAILBOX}>`,
      to: [HOSTINGER_MAILBOX, PERSONAL_EMAIL_TO],
      subject: `New lead — ${name} (${source})`,
      text,
      html,
    });
  } catch (err) {
    console.error("Lead capture: Hostinger SMTP send failed", err);
    return NextResponse.json({ ok: false, error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
