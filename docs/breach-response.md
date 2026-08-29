# Breach response — jetageindia.in

DPDP Module 08. One page, because a plan nobody can read at 2am is not a plan.

Grievance Officer / owner: Ishaan Walia (waliaishaan17@gmail.com).
Last reviewed: 2026-08-29.

## What counts as a breach

Any unauthorised access to, disclosure of, or loss of personal data. This site
holds no customer database, so the realistic list is short and it is almost all
about mailboxes and accounts:

- **`info@jetageindia.in` is accessed by someone who should not have it.** Every
  enquiry lives there. This is the main one.
- **The Gmail account that receives the second copy is compromised.**
- **`HOSTINGER_EMAIL_PASSWORD` leaks** — it is SMTP credentials for the mailbox
  above, so this is the same event by another route. Rotate it first.
- The Neon database or an `admin_users` account is compromised. Lower impact for
  customers: it holds the catalogue and staff logins, not visitors.
- Vercel or Hostinger notify us of an incident affecting our account.
- The domain or DNS is hijacked and the form is pointed elsewhere.

Note the shape: **the exposure here is inbox and credential security, not
application security.** Two-factor authentication on both mailboxes is worth
more than anything in this codebase.

## First hour

1. **Contain.** Change the password and revoke sessions on the affected account.
   Rotate `HOSTINGER_EMAIL_PASSWORD` in Vercel if the mail path is implicated.
2. **Do not delete anything.** Mail, logs and headers are the evidence of what
   happened and how far it went.
3. **Write down the clock.** Discovery timestamp, in IST, in writing. Both
   deadlines below run from it.
4. **Scope it** with the four questions.

## The four scope questions

- **What was exposed?** Names, phone numbers, enquiry text — or only metadata?
- **How many people?** Count the enquiries in the affected period. Do not
  estimate.
- **Over what window?** First and last possible moment of exposure.
- **Is it still open?** If containment is not confirmed, it is still open.

## Notification — two deadlines, not one

**1 — On becoming aware: notify immediately.** Both the Data Protection Board
*and* every affected person, without waiting for the investigation to be tidy.
To affected people, in plain language: what happened, what data of theirs was
involved, **what they can do to protect themselves**, and how to reach us. No
minimising.

**2 — Within 72 hours: the detailed report** to the Board — full scope, root
cause, numbers affected, remediation.

The intimation mechanism is published at `dpdpboard.gov.in`. Check it at the
time rather than trusting this document; the Board's procedures are new.

## Escalation order

1. Ishaan Walia — decides everything, notifies the Board.
2. The affected people — directly, by phone or WhatsApp, since that is how they
   contacted us and we may not have an email address for them.
3. The processor involved (Hostinger, Vercel, Neon) — their support channel, in
   writing, so there is a record of when they were told.
4. A lawyer — if the scope is more than a handful of people.

## Record every incident

Even the ones that turn out to be nothing. Discovery timestamp, what was
affected, how many records, root cause, what was done, when it closed. A written
history is what turns "we think we're fine" into something showable to the Board.

## Known gap, and how to close it

There is no anomaly detection, access monitoring or log aggregation. Detection
today is a processor telling us, or somebody noticing.

**This is now closable.** The Vercel account is on Pro, which has Log Drains and
Audit Logs. Piping them somewhere alertable is the highest-value fix available
for this module.

**And Pro cuts the other way:** longer log retention means the `clientIp` in
Vercel's request logs is held longer. Give the drain an expiry rather than
letting the default ride.
