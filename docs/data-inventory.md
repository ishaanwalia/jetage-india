# Data inventory — jetageindia.in

DPDP Module 03's mandatory first step: every piece of personal data this site
collects, why, how long it stays, and where it goes. Built by reading the code —
each row names the file that puts the data there.

Last verified: 2026-08-29.

## What this site collects

| Field | Collection point | Purpose | Lawful basis | Retention | Stored where | Shared with |
| --- | --- | --- | --- | --- | --- | --- |
| Name | Quote form — `src/components/QuickQuoteForm.tsx` | Reply and prepare a quote | Consent | 5 years from last exchange | Email inboxes only | Hostinger → Gmail |
| Phone number | Quote form — same | Reply and prepare a quote | Consent | 5 years from last exchange | Email inboxes only | Hostinger → Gmail |
| Product interest | Quote form — same | Quote the right thing | Consent | 5 years from last exchange | Email inboxes only | Hostinger → Gmail |
| Notes / message | Quote form — same | Reply and prepare a quote | Consent | 5 years from last exchange | Email inboxes only | Hostinger → Gmail |
| Consent record (wording shown, version, timestamp) | Quote form — same | Evidence of what was agreed | Consent / legal obligation | With the enquiry | Email inboxes only | as above |
| **IP address, user agent** | **Every request — Vercel edge, no app code involved** | Serving the site; fault and abuse investigation | Sec. 7 legitimate use | Vercel's plan schedule | Vercel request logs | Vercel |
| Staff email, password hash, session | `admin_users`, `sessions` in Neon | Staff login for the catalogue CMS | Employment / contract | While the person works here | Neon | Neon |
| `audit_log.actor_email` | Admin actions | Knowing who changed what | Employment / contract | Life of the log | Neon | Neon |

## Correction — retention (2026-08-29)

An earlier version of this file claimed enquiries were kept "24 months from the
last exchange". **That number was invented** — nobody had decided it, and it had
reached the consent sentence itself, so visitors would have been agreeing to a
schedule that did not exist.

Asked and answered: the period is **5 years from the last exchange**, decided by
the owner on 2026-08-29. Enforcement is a calendar reminder and a person, not a
job, and the notice says so.

## Not personal data, but collected — recorded so nothing is hidden

**Cost calculator pings.** `src/app/cost-calculator/CostCalculatorClient.tsx`
POSTs to `/api/lead/` with `name: "Cost calculator visitor"` and
`phone: "not provided"` — a fixed placeholder, not the visitor. The payload is
printing volume, colour percentage and which technology won.

It carries **no name, number, or identifier of any kind**, and fires only on an
explicit button press, never automatically. So it is anonymous product feedback
rather than personal data, and it is disclosed in the privacy notice anyway on
the principle that silent collection is what erodes trust, not the data itself.

Worth flagging for whoever touches this next: it travels through a route called
`/api/lead` and arrives in an inbox as "New lead". The naming implies a person
where there is none. Not a compliance defect — a readability one.

## What is deliberately absent

**No customer database.** No accounts, no login for visitors, no orders table,
no leads table. Enquiries are emailed and never written to Neon. The database
holds the product catalogue, articles and staff logins — nothing about a
visitor. This is the strongest position available and it is worth protecting:
adding a leads table would create obligations that currently do not exist.

**No analytics of any kind.** No Google Analytics, no Vercel Analytics, no tag
manager, no advertising pixel, no session recording, no heatmaps. Zero
third-party scripts. Module 09 has nothing to review, which is the best possible
outcome for it.

**No IP addresses in anything we write.** But see the row above — Vercel logs
them on our behalf, and those are records we control. The notice says so.
Before writing any "we do not collect X" here, check what Vercel, Neon and
Hostinger record for us.

## Where personal data physically travels

    quote form
      → /api/lead (Vercel, US — server function)
      → smtp.hostinger.com     (Hostinger, EU)
      → info@jetageindia.in    (Hostinger mailbox, EU)
      → ishaan.walia.148@...   (Gmail, US — second copy)

    quote form, separately and only if the visitor presses send
      → their own WhatsApp     (Meta, US)

Five hops, three jurisdictions. All are named in `src/lib/dpdp.ts` and rendered
by the privacy notice, so the disclosure cannot drift from reality without
someone editing the array.

## One thing fixed while writing this

`src/app/api/lead/route.tsx` used to `console.error(..., body)` when the SMTP
password was unset — writing the enquirer's name, phone number and free text
into Vercel's logs, retained on Vercel's schedule rather than ours. That is a
second copy of personal data nothing tracks and nothing deletes. It now logs the
form name only.

## Maintenance rule

A dependency that touches personal data goes into `DATA_RECIPIENTS` in
`src/lib/dpdp.ts` **in the same commit**. `npm run check:dpdp` fails otherwise —
it is not left to memory.
