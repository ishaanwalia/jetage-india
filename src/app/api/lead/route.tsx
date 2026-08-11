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
    console.error("Lead capture: HOSTINGER_EMAIL_PASSWORD not set — email not sent.", body);
    return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 202 });
  }

  const { name, phone, interest, message, source } = body;
  const time = `${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`;
  const text = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    interest ? `Interested in: ${interest}` : null,
    message ? `Notes: ${message}` : null,
    `Source: ${source}`,
    `Time: ${time}`,
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
