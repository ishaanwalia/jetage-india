import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import {
  Shield,
  Lock,
  Eye,
  Server,
  UserCheck,
  Mail,
  Clock,
  Baby,
  Scale,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  FIDUCIARY,
  GRIEVANCE_OFFICER,
  DATA_RECIPIENTS,
  RETENTION,
  CONSENT_PURPOSE,
} from "@/lib/dpdp";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Jetage India collects, uses and protects your personal data, and how to exercise your rights under India's DPDP Act 2023.",
  alternates: {
    canonical: "/privacy/",
  },
};

const mailto = (subject: string) =>
  `mailto:${GRIEVANCE_OFFICER.email}?subject=${encodeURIComponent(subject)}`;

export default function PrivacyPage() {
  const sections: { icon: typeof Shield; title: string; content: ReactNode }[] = [
    {
      icon: Scale,
      title: "Who is responsible",
      content: (
        <>
          {FIDUCIARY.name}, trading as {FIDUCIARY.tradingAs}, is the Data
          Fiduciary for this site under India&rsquo;s Digital Personal Data
          Protection Act, 2023 — we decide why data is collected here and we
          carry the responsibility for it. {FIDUCIARY.representative} is the
          person accountable, and is also our Grievance Officer.
        </>
      ),
    },
    {
      icon: Shield,
      title: "What we collect, and why",
      content: (
        <>
          <p>
            If you use the quote form, we collect the{" "}
            <strong>name, phone number, product interest and notes</strong> you
            type, and the fact that you ticked the consent box. That is all — the
            form has no hidden fields.
          </p>
          <p className="mt-3">
            The exact purpose you agree to is this, word for word:{" "}
            <em>&ldquo;{CONSENT_PURPOSE}&rdquo;</em>
          </p>
          <p className="mt-3">
            If you message us on WhatsApp, call, or email directly, that
            conversation is governed by the platform you used rather than by us.
          </p>
          <p className="mt-3">
            The cost calculator sends us an anonymous note when you press the
            quote button — your printing volume and which option came out
            cheapest. It contains <strong>no name, number or identifier</strong>{" "}
            and cannot be traced back to you.
          </p>
        </>
      ),
    },
    {
      icon: Lock,
      title: "What we do with it, and what we don't",
      content: (
        <>
          <p>
            Your enquiry is used to reply to you and prepare a quote. That is the
            only purpose, and it is the one you consented to.
          </p>
          <ul className="mt-3 space-y-1.5 list-disc pl-5">
            <li>We never sell or rent your information.</li>
            <li>
              No marketing messages unless you ask for them — an enquiry does not
              put you on a list.
            </li>
            <li>
              No advertising pixels, no tag manager, no analytics product and no
              tracking cookies. This site runs no third-party scripts at all.
            </li>
            <li>No profiling, and no automated decisions about you.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Eye,
      title: "Who else receives it",
      content: (
        <>
          <p>
            Everyone who touches personal data from this site is listed here,
            with what each actually receives and where they are. Some are outside
            India; the DPDP Act permits transfer to any country the Central
            Government has not restricted, and none has been. Our responsibility
            for these companies does not pass to them — it stays with us.
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            {DATA_RECIPIENTS.map((r) => (
              <li key={r.name}>
                <strong>{r.name}</strong> ({r.country}) — {r.purpose}.{" "}
                <span className="text-jet-text-muted">{r.receives}.</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      icon: Clock,
      title: "How long we keep it",
      content: (
        <>
          <ul className="space-y-2 list-disc pl-5">
            {RETENTION.map((r) => (
              <li key={r.what}>
                <strong>{r.what}</strong> — {r.period}.{" "}
                <span className="text-jet-text-muted">{r.why}.</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Being straight about the mechanism: enquiries live in an email inbox,
            and we do not currently run any schedule that deletes them. We would
            rather say that than publish a tidy-sounding period we do not keep
            to. What we will do is delete yours whenever you ask — the links
            below reach us directly.
          </p>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: "Your rights under the DPDP Act",
      content: (
        <>
          <p>
            Use these to exercise any of them. We reply within{" "}
            {GRIEVANCE_OFFICER.responseDays} days, usually much sooner.
          </p>
          <ul className="mt-3 space-y-1.5 list-disc pl-5">
            <li>
              <a
                className="underline hover:text-jet-primary"
                href={mailto("Data request")}
              >
                Make a data request
              </a>{" "}
              — see what we hold, correct it, or have it deleted
            </li>
            <li>
              <a
                className="underline hover:text-jet-primary"
                href={mailto("Withdraw consent")}
              >
                Withdraw your consent
              </a>{" "}
              — as easy as giving it was
            </li>
            <li>
              <a
                className="underline hover:text-jet-primary"
                href={mailto("Grievance")}
              >
                Raise a grievance
              </a>{" "}
              with our Grievance Officer
            </li>
            <li>
              <a
                className="underline hover:text-jet-primary"
                href="https://dpdpboard.gov.in"
                target="_blank"
                rel="noreferrer"
              >
                Complain to the Data Protection Board of India
              </a>{" "}
              if we do not resolve it
            </li>
          </ul>
          <p className="mt-3">
            You also have the <strong>right to nominate</strong> someone to
            exercise these rights for you if you die or become unable to. This
            right is specific to Indian law. Write to the Grievance Officer with
            your nominee&rsquo;s name and contact details and we will record it.
          </p>
        </>
      ),
    },
    {
      icon: Baby,
      title: "Children",
      content: (
        <>
          This is a business selling printers and IT hardware, and is not directed
          at anyone under 18. We do not knowingly collect a child&rsquo;s data.
          Nobody using this site is tracked, profiled or advertised to at any age,
          so the protections the Act gives children hold here simply because the
          site does none of those things to anyone. If you believe a child has
          sent us their details, tell our Grievance Officer and we will delete
          them.
        </>
      ),
    },
    {
      icon: Server,
      title: "Security, and what happens if something goes wrong",
      content: (
        <>
          <p>
            Enquiries live in mailboxes protected by two-factor authentication.
            The site itself stores nothing about visitors — there is no customer
            database and no login for customers.
          </p>
          <p className="mt-3">
            If a personal data breach happens, we will tell the Data Protection
            Board and everyone affected as soon as we become aware, with a full
            report to the Board within 72 hours. We will tell you what happened,
            what data of yours was involved, what you can do to protect yourself,
            and how to reach us about it.
          </p>
        </>
      ),
    },
    {
      icon: Mail,
      title: "Grievance Officer",
      content: (
        <>
          <p>
            The Act requires a named person, not a general office address. Ours
            is:
          </p>
          <ul className="mt-3 space-y-1.5 list-disc pl-5">
            <li>
              <strong>{GRIEVANCE_OFFICER.name}</strong> — Grievance Officer,{" "}
              {FIDUCIARY.tradingAs}
            </li>
            <li>
              <a
                className="underline hover:text-jet-primary"
                href={`mailto:${GRIEVANCE_OFFICER.email}`}
              >
                {GRIEVANCE_OFFICER.email}
              </a>
            </li>
            <li>WhatsApp: +91 98149 58295</li>
            <li>SCO-12, 1st Floor, Sector 17-E, Chandigarh</li>
          </ul>
          <p className="mt-3">
            Put &ldquo;Grievance&rdquo; in the subject line. You will get an
            acknowledgement and a real answer within{" "}
            {GRIEVANCE_OFFICER.responseDays} days. If you are not satisfied, you
            can escalate to the Data Protection Board of India.
          </p>
        </>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />

      <div className="pt-28 pb-16 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                Legal
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-jet-text">
                Privacy <span className="text-gradient-gold">Policy</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                Last updated: 29 August 2026. Written to say what actually happens
                to your details, in plain language.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {sections.map((section, i) => (
            <Reveal key={section.title} direction="up" delay={i * 0.1}>
              <div
                id={
                  section.title === "Grievance Officer" ? "grievance" : undefined
                }
                className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 hover:border-jet-border-strong transition-all scroll-mt-28"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-jet-primary/20">
                    <section.icon className="w-6 h-6 text-jet-primary" />
                  </div>
                  <div className="text-jet-text-dim leading-relaxed">
                    <h2 className="text-xl font-bold text-jet-text mb-3">
                      {section.title}
                    </h2>
                    {section.content}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
