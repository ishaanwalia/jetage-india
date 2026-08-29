"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { CONSENT_PURPOSE, CONSENT_NOTICE_VERSION } from "@/lib/dpdp";

const WHATSAPP_NUMBER = "919814958295";
const EMAIL_TO = "info@jetageindia.in";

export function QuickQuoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Printers");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; consent?: string }>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const next: { name?: string; phone?: string; consent?: string } = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!/^[0-9+\-\s]{7,15}$/.test(phone.trim())) next.phone = "Enter a valid phone number.";
    // DPDP Sec. 6: consent is given, never inferred from pressing submit.
    if (!consent) next.consent = "Please tick the box so we can reply to you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const lines = [
      `Hi Jetage, I'd like a quote.`,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Interested in: ${interest}`,
      message.trim() ? `Notes: ${message.trim()}` : null,
    ].filter(Boolean);
    const body = lines.join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // mailto: hands off to the visitor's own mail app — best-effort, since a
    // visitor with no configured mail app won't see anything happen. The
    // fetch below is the real, guaranteed-delivery channel: it doesn't
    // depend on the visitor's device having WhatsApp or a mail client.
    const subject = `Quote Request - ${name.trim()}`;
    const mailtoUrl = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    fetch("/api/lead/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        interest,
        message: message.trim(),
        source: "quick-quote-form",
        // What this person was actually shown when they agreed. With no leads
        // table, the enquiry email is the only place a consent record can
        // live — so it carries one.
        consentGiven: CONSENT_PURPOSE,
        consentNoticeVersion: CONSENT_NOTICE_VERSION,
        consentAt: new Date().toISOString(),
      }),
    }).catch(() => {});

    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-jet-success mx-auto" />
        <h3 className="text-xl font-bold text-jet-text">Opening WhatsApp &amp; Email…</h3>
        <p className="text-jet-text-dim">
          We've pre-filled your details in WhatsApp, and started an email to info@jetageindia.in in your mail app.
          Just hit send on whichever opened for you — our team replies during business hours.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm font-semibold text-jet-primary hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 space-y-5" noValidate>
      <div>
        <h2 className="text-2xl font-bold text-jet-text">Get a Quick Quote</h2>
        <p className="text-jet-text-dim mt-1 text-sm">
          Share your details once — we'll hand them straight to WhatsApp and email so you don't have to type them out twice.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="qq-name" className="block text-sm font-semibold text-jet-text mb-1.5">Name</label>
          <input
            id="qq-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "qq-name-error" : undefined}
            className="w-full px-4 py-2.5 bg-jet-bg-elevated border border-jet-border rounded-xl text-jet-text focus:outline-none focus:border-jet-primary focus:ring-2 focus:ring-jet-primary/30 transition-all"
            placeholder="Your name"
          />
          {errors.name && <p id="qq-name-error" className="text-xs text-jet-primary mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="qq-phone" className="block text-sm font-semibold text-jet-text mb-1.5">Phone</label>
          <input
            id="qq-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "qq-phone-error" : undefined}
            className="w-full px-4 py-2.5 bg-jet-bg-elevated border border-jet-border rounded-xl text-jet-text focus:outline-none focus:border-jet-primary focus:ring-2 focus:ring-jet-primary/30 transition-all"
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p id="qq-phone-error" className="text-xs text-jet-primary mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="qq-interest" className="block text-sm font-semibold text-jet-text mb-1.5">Interested in</label>
        <select
          id="qq-interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full px-4 py-2.5 bg-jet-bg-elevated border border-jet-border rounded-xl text-jet-text focus:outline-none focus:border-jet-primary focus:ring-2 focus:ring-jet-primary/30 transition-all"
        >
          <option>Printers</option>
          <option>Accessories</option>
          <option>Not sure yet</option>
        </select>
      </div>

      <div>
        <label htmlFor="qq-message" className="block text-sm font-semibold text-jet-text mb-1.5">
          Anything specific? <span className="font-normal text-jet-text-muted">(optional)</span>
        </label>
        <textarea
          id="qq-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 bg-jet-bg-elevated border border-jet-border rounded-xl text-jet-text focus:outline-none focus:border-jet-primary focus:ring-2 focus:ring-jet-primary/30 transition-all resize-none"
          placeholder="e.g. budget, model in mind, office vs home use"
        />
      </div>

      {/* The purpose is shown here, beside the fields, rather than behind a
          link — DPDP wants it at the point of collection and in plain language.
          Never pre-ticked. */}
      <div>
        <label htmlFor="qq-consent" className="flex items-start gap-3 cursor-pointer">
          <input
            id="qq-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "qq-consent-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-jet-primary"
          />
          <span className="text-xs leading-relaxed text-jet-text-dim">
            {CONSENT_PURPOSE}{" "}
            <a href="/privacy/" className="underline hover:text-jet-primary">
              Privacy policy
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="qq-consent-error" className="text-xs text-jet-primary mt-1">
            {errors.consent}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-whatsapp text-jet-text rounded-xl font-bold hover:bg-[#128C7E] transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        Continue on WhatsApp
      </button>
    </form>
  );
}
