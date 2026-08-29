/**
 * DPDP Act 2023 — the facts this site has to state, in one place.
 *
 * The privacy notice renders these, and the quote form shows the same consent
 * sentence it sends. One module rather than several because that is the whole
 * point: a notice describing different behaviour from the form is a false
 * disclosure, and the way that happens is two files drifting apart.
 *
 * Leads are not stored in the database — they are emailed. So there is no
 * consent ledger table here and no erasure endpoint: the record of a decision
 * travels with the lead email, and erasure means deleting mail. Building a
 * leads table to hold consent records would create more personal data than it
 * documents.
 */

/** The Data Fiduciary — the business that decides why data is collected here. */
export const FIDUCIARY = {
  name: "Jetage Computer Traders",
  tradingAs: "Jetage India",
  representative: "Ishaan Walia",
  country: "India",
} as const;

/**
 * The Grievance Officer — DPDP Sec. 13.
 *
 * A **named individual**, not a shared inbox: the Act wants someone who can
 * actually resolve a complaint, and "write to info@" is specifically what the
 * requirement exists to prevent. The same person is the officer across this
 * group of businesses, so the contact is deliberately the same everywhere — a
 * complaint reaches them wherever it is raised.
 */
export const GRIEVANCE_OFFICER = {
  name: "Ishaan Walia",
  email: "waliaishaan17@gmail.com",
  /** Published commitment. The Act sets no fixed number; this is ours. */
  responseDays: 30,
} as const;

export type DataRecipient = {
  name: string;
  purpose: string;
  /** What they actually receive — not "your data". */
  receives: string;
  country: string;
};

/**
 * Every third party that receives personal data from this site — Sec. 16.
 *
 * The misconception the Act does not accept is "our host handles compliance".
 * Every entry here is a Data Processor and the liability is ours. Transfers are
 * permitted to any country the Central Government has not restricted, and no
 * restriction has been notified.
 *
 * **A dependency that touches personal data goes in this array in the same
 * commit** — `npm run check:dpdp` fails the build otherwise.
 */
export const DATA_RECIPIENTS: DataRecipient[] = [
  {
    name: "Vercel",
    purpose: "Hosting and content delivery",
    // Named explicitly because it is the claim most easily got wrong: every
    // host logs the requesting address. Saying "we don't collect IP addresses"
    // would be false no matter what this codebase does.
    receives:
      "Requests to the site — the pages you open, your IP address and browser, kept in Vercel's request logs",
    country: "United States",
  },
  {
    name: "Neon",
    purpose: "Database for the product catalogue and the staff login",
    receives:
      "Nothing about visitors. Product and article content, and the staff accounts that manage it",
    country: "United States",
  },
  {
    name: "Hostinger",
    purpose: "Sends and holds the info@jetageindia.in mailbox",
    receives: "Your enquiry — the name, phone number and notes you typed",
    country: "Lithuania / EU",
  },
  {
    name: "Google (Gmail)",
    purpose: "A second copy of each enquiry reaches a Gmail account",
    receives: "Your enquiry, as above",
    country: "United States",
  },
  {
    name: "WhatsApp (Meta)",
    // Worth stating plainly rather than hiding: the form does not send this on
    // the visitor's behalf. It opens their own WhatsApp with the message
    // pre-filled, and nothing reaches Meta unless they press send themselves.
    purpose:
      "The quote form opens WhatsApp with your message pre-filled — you choose whether to send it",
    receives:
      "Whatever you actually send, if you send it. Governed by WhatsApp's own privacy terms, not ours",
    country: "United States",
  },
];

export type RetentionRule = {
  what: string;
  period: string;
  why: string;
  /** Stated honestly: a period nothing enforces is a claim the data disproves. */
  enforcement: "none" | "manual" | "processor" | "automated";
};

export const RETENTION: RetentionRule[] = [
  {
    what: "Enquiry emails in our inboxes",
    period:
      "Kept while the enquiry is still useful to us. We do not currently delete " +
      "them on a schedule — ask and we will delete yours",
    why: "Hardware buyers often come back a year later about the same quote",
    enforcement: "none",
  },
  {
    what: "Vercel request logs (these include your IP address)",
    period: "Retained by Vercel on their plan's schedule",
    why: "Serving the site, and investigating faults or abuse",
    enforcement: "processor",
  },
  {
    what: "Staff accounts and the admin audit log",
    period: "While the person works here, then removed",
    why: "Knowing who changed what in the catalogue",
    enforcement: "manual",
  },
];

/**
 * The version of the consent wording a decision was given against. Bump it when
 * `CONSENT_PURPOSE` changes, so an old record stays legible as a decision about
 * *older* wording rather than being silently read as agreement to this one.
 */
export const CONSENT_NOTICE_VERSION = "2026-08-29b";

/** The exact sentence shown beside the quote form's consent checkbox. */
export const CONSENT_PURPOSE =
  "Use my name, phone number and notes to reply to this enquiry and prepare a " +
  "quote, and keep it in the Jetage inbox until it is no longer needed. No " +
  "marketing messages unless I ask for them.";
