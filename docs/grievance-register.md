# Grievance register — jetageindia.in

DPDP Module 07. The log of every request and complaint a visitor makes about
their data, and what we did about it.

Owner: Ishaan Walia (Grievance Officer). Last reviewed: 2026-08-30.

**This site is live.** Of the sites in this estate it is the one actually taking
enquiries from the public today, which makes this the register most likely to be
needed and the sweep most likely to matter.

---

## What this is, and why it exists

The Act asks for two things, and doing the first makes it easy to believe you
have finished:

1. **A mechanism** — Sec. 8(9). A published route to complain. We have it: the
   Grievance Officer is named in the privacy notice, and the footer links to it
   from every page.
2. **Evidence the mechanism works** — Sec. 13. A Data Principal has a *right* to
   redressal and must exhaust it before going to the Board. When they do go, the
   Board asks us what happened.

This file is the second. A mailbox cannot answer "was this handled, and how
fast" — it is a pile of mail. The register can, and it is the only artefact that
can.

---

## Where the live register lives — not here

**Never put real entries in this repository.** They contain names, phone numbers
and the fact that a named person complained — the last of which is personal data
*about someone exercising a legal right*. Commits are permanent even after a
later commit removes the file.

| | Where |
| --- | --- |
| **This file** | The template and the procedure. Public, no personal data. |
| **The live register** | A private Google Sheet in the `waliaishaan17@gmail.com` Drive, named `Jetage — Grievance Register`. |

**One sheet per business, not one shared sheet.** Jetage Computer Traders is a
different Data Fiduciary from Webnet Asia and from Inder Thakral. If the Board
asks Jetage for its register, handing over a file that also contains Webnet
Asia's complainants would be a disclosure of unrelated people's data caused by
answering a lawful request. Keep them separate.

---

## The columns

Row 1 of the sheet:

```csv
Ref,Received,Name,Phone,Type,What they asked for,Acknowledged,Action taken,Closed,Days
```

`Phone` rather than `Email`, because the quote form collects a phone number and
not everyone who enquires leaves an address. Whichever identifier they used goes
in the column — it is there to match them to their enquiry.

| Column | What goes in it |
| --- | --- |
| **Ref** | `JCT-G-2026-001`, incrementing |
| **Received** | Date it arrived, IST. Not the date you noticed it |
| **Name / Phone** | As given. Also the identity check — see below |
| **Type** | Access / Correction / Erasure / Withdrawal / Nomination / Complaint / Other |
| **What they asked for** | One line, plain |
| **Acknowledged** | Date the reply went out. Should be same-day |
| **Action taken** | What was done. **If refused, the reason goes here** |
| **Closed** | Date the matter ended |
| **Days** | `=Closed-Received`. The number that shows the 30-day commitment is real |

Add nothing else. A register with twenty columns does not get filled in.

---

## What counts as a grievance

Wider than the word suggests. Every one of these gets a row:

- "Send me what you hold about me" — **Access**
- "My number is wrong" — **Correction**
- "Delete my enquiry" — **Erasure**
- "Stop using my data" — **Withdrawal**
- "If I die, my brother handles this" — **Nomination** (India-specific, no GDPR
  equivalent, so the one most often missed)
- "You never replied" — **Complaint**

If it arrives at the Grievance Officer address at all, log it — marking a row
"no action required" is safer than deciding from memory two years later that it
did not count. Requests that land on `info@jetageindia.in` or come in over
WhatsApp count too; **Received** is when it first arrived anywhere, not when it
was forwarded on.

---

## The clock

**30 days.** Not a number from the Act — `src/lib/dpdp.ts` sets
`responseDays: 30` and the privacy notice renders it. We published it, so it
binds us regardless of any longer statutory ceiling.

Two dates on purpose: **Acknowledged** proves someone picked it up,
**Closed** proves it finished. Logging only one lets a slow resolution hide
behind a fast reply.

### Identity check, before acting on access or erasure

The failure this prevents: someone asks for a copy of another person's enquiry,
and gets it — a breach we caused by being helpful.

The check here is proportionate: **the request must come from the same phone
number or email as the original enquiry.** If it does not, reply to the contact
details on the original and ask them to confirm from there. "I changed my
number" without confirmation from the old one is the exact story an impersonator
tells.

Write the check into **Action taken**: `identity confirmed — same number as
original enquiry`. A fulfilled access request with no recorded check looks
identical to a leak.

---

## Two kinds of erasure, and only one waits for a request

**On request — Sec. 12(3).** Someone asks, you delete, you confirm, you log.
Reactive. This is what most people picture.

**Because the purpose is finished — Sec. 8(7).** The duty arises on its own once
the data is no longer needed and no law requires keeping it. **Nobody has to
ask.** If erasure only followed requests, publishing "5 years" would mean
nothing — the point of publishing a period is that it commits us to acting
unprompted.

The annual sweep is the mechanism for the second duty. It runs whether or not
anyone complains.

### "I would forget whose data I even have"

True, and it does not matter. There is no customer list — Neon holds the
catalogue and staff accounts, not enquirers (see `docs/data-inventory.md`), so
enquiries exist only as mail. Memory was never going to be the mechanism.

**The search is the list.** The mailbox already knows who wrote in and when:

- **For the sweep** — everyone past the period, without having tracked anyone.
- **For one person** — search their number or address across all mail.

---

## The stores — there are three, and that is the whole difficulty

From `docs/data-inventory.md`, verified 2026-08-30:

| Store | What it holds | Can it be swept by age? |
| --- | --- | --- |
| `info@jetageindia.in` — Hostinger webmail, EU | Every enquiry | By sorting on date. Hostinger publishes no auto-delete |
| `ishaan.walia.148@gmail.com` — Gmail, US | **A second copy of every enquiry** | Yes, by search. Not by filter — see below |
| Jetage's WhatsApp — Meta, US | Enquiries sent through the WhatsApp button | **No. Manual only** |

**The sweep is not done until all three are done.** Deleting from Gmail while the
Hostinger copy remains leaves the retention policy false while looking satisfied,
and that is the failure mode this table exists to prevent.

**Note which Gmail.** The second copy goes to `ishaan.walia.148@gmail.com`,
which is *not* the Grievance Officer address (`waliaishaan17@gmail.com`). The
Officer must be able to sign into that account to fulfil an erasure request, or
the mechanism has a gap that only appears the first time someone asks.

### Neither provider deletes by age. Verified 2026-08-30

- **Hostinger** publishes no retention or auto-delete feature.
- **Gmail filters cannot delete by age.** This is the trap. Put `older_than:5y`
  in a filter with "Delete it" and it looks like automation, but Gmail filters
  only run on *incoming* mail and a five-year-old message is never incoming. The
  filter sits there doing nothing while you believe deletion is handled. Only
  the one-time **"Also apply filter to matching conversations"** checkbox fires.

So: **a manual sweep, once a year, logged.** Roughly 20 minutes for three
stores. A logged manual process is a real control; an unlogged one is a promise.

---

## The annual sweep

Second tab in the sheet, `Retention sweeps`:

```csv
Date,Store,How swept,Found,Deleted,Trash emptied,Done by,Notes
```

**One row per store.** Three rows per sweep, or the log cannot show that the job
was finished rather than started.

1. **Gmail** (`ishaan.walia.148@gmail.com`) — search:

   ```
   older_than:5y -newer_than:5y
   ```

   The negation matters. Plain `older_than:5y` returns whole *conversations*
   containing any old message, including a six-year-old thread replied to last
   month. Bulk-deleting that set would destroy live correspondence and break
   "5 years from the **last** exchange".

2. **Read the results before deleting.** Check the newest few and confirm they
   really are past the period. This is the only safeguard a bulk delete has.

3. **Delete, then empty Trash.** Gmail holds deleted mail 30 more days. Until
   Trash is emptied the data still exists and "we deleted it" is not yet true.

4. **Hostinger webmail** — no age search needed: sort by date, oldest first, and
   delete everything whose last exchange predates the cutoff. Empty its Trash
   too. Sorting by date works in any webmail, which is why it is the instruction
   here rather than a query syntax that may not exist.

5. **WhatsApp** — the honest one. There is no age filter and no bulk tool.
   Scroll the chat list, open conversations older than the cutoff, delete them.
   If the volume ever makes that impractical, that is the signal to stop taking
   enquiries over WhatsApp rather than to quietly stop sweeping.

6. **Log all three**, then set next year's reminder before closing the tab.

### The first sweep is now, not 2031

The five-year clock applies to enquiries **already in those mailboxes**, not
only to ones collected after the policy was written. Anything last touched
before **August 2021** is past the period today.

This is the part that makes the policy true rather than aspirational. The
privacy notice on a live site currently makes a claim about these inboxes that
the inboxes have never been made to honour.

For this first pass only, Gmail's **"Also apply filter to matching
conversations"** is genuinely useful — a one-time bulk action is exactly what a
backlog needs. After that it is the annual sweep.

---

## Fulfilling one person's erasure request

1. Confirm identity (above).
2. **Gmail** — search **All Mail**, both directions, so archived and Spam are
   included:

   ```
   from:their@address.com OR to:their@address.com
   ```

   For a phone-only enquirer, search the number instead — it is in the body of
   the enquiry email, so a plain text search finds it.
3. **Delete, then empty Trash.**
4. **Hostinger webmail** — repeat. The second copy is the one that gets
   forgotten.
5. **WhatsApp** — delete the conversation if they contacted that way.
6. **Neon** — nothing to do. It holds the catalogue and staff accounts, not
   enquirers. Worth confirming rather than assuming, and it is confirmed in
   `docs/data-inventory.md`.
7. **Reply to confirm**, then log the row.

**One limit to state if they ask.** Their IP address may sit in Vercel's request
logs. Those are not searchable by person, cannot be selectively edited, and
expire on Vercel's schedule — already disclosed in the privacy notice. Say what
was deleted and what expires on its own. Overstating an erasure to a Data
Principal is worse than the limitation.

---

## Worked examples

Illustrative, not real entries.

| Ref | Received | Type | What they asked for | Acknowledged | Action taken | Closed | Days |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JCT-G-2026-001 | 2026-09-04 | Erasure | Delete my quote request | 2026-09-04 | Identity confirmed — same number as original. Deleted from Gmail and Hostinger, both Trash emptied. No WhatsApp thread. Confirmed by SMS. | 2026-09-05 | 1 |
| JCT-G-2026-002 | 2026-10-11 | Access | Everything you hold | 2026-10-11 | Identity confirmed. Sent both enquiry emails plus the recipients list from the notice. Explained the Vercel log position. | 2026-10-14 | 3 |
| JCT-G-2026-003 | 2026-11-02 | Complaint | Says they never agreed to be contacted | 2026-11-02 | Checked the enquiry — consent line and notice version present in the email. Sent them the exact wording they ticked. Not upheld, explained why. | 2026-11-06 | 4 |

Row 003 is why the consent text travels inside the enquiry email. With no
database, that email is the only evidence of what the person was shown, and
without it the answer to that complaint is "we think you did."

---

## What the owner has to do

None of this is code.

1. **Create the sheet** — two tabs, headers from the two CSV lines above.
2. **Confirm the Grievance Officer can sign into `ishaan.walia.148@gmail.com`.**
   Erasure requires reaching the second copy. This is a five-second check that
   turns into a blocked request at the worst moment if it was never done.
3. **Run the first sweep** on all three stores for anything predating August
   2021, and log it. This site is live, so this is the one with real data behind
   it.
4. **Two calendar reminders** — annual sweep on 1 September, and a monthly
   thirty-second "anything unlogged?" check.
5. **Auto-acknowledgement** on the Grievance Officer mailbox for "Grievance",
   "Data request" and "Withdraw consent" subjects. This *does* work as a Gmail
   filter — those messages genuinely are incoming — and it fills the
   Acknowledged column without anyone remembering.
6. **Decide how long grievance records are kept.** Left unset on purpose rather
   than guessed, and it is not obviously the same five years: the register row
   is the proof an erasure happened, so there is a case for it outliving the
   data it concerns.
