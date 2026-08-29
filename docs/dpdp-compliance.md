# DPDP — where this site stands

**Self-assessed by the implementer on 2026-08-29. Not independently reviewed.**
Not legal advice.

Scored against the compliance checklist's nine modules, **corrected against the
DPDP Rules 2025** (notified 13 Nov 2025) where the two differ — the checklist
predates the Rules and is wrong about the breach timeline in particular.

Compliance deadline **13 May 2027**; penalty machinery live **13 Nov 2026**;
complaints can be filed with the Board today. This site is **live at
jetageindia.in**, so it carries real exposure now rather than in 2027.

---

## Unmet CRITICAL items: 2

Critical items are **pass/fail**. The scores below are a progress indicator and
must not be averaged into a verdict.

**1 · No self-serve access to your own data** — Module 04.
Access, correction and erasure are honoured by emailing the Grievance Officer
within 30 days. The checklist wants it self-serve "from within the app".
*What would close it:* customer accounts — which would mean building a customer
database this site deliberately does not have, creating more obligations than it
discharges. **Standing exception, recorded as a decision, not a backlog item.**

**2 · No signed DPAs** — Module 06, and the matching Module 09 item.
Vercel, Neon, Hostinger and Google all receive personal data and none has a
signed processing agreement. *What would close it:* **owner action, this week.**
**Vercel is already covered** — its Data Processing Addendum states it "applies
to Vercel's Processing of Personal Data as a Processor ... for Customers who are
on Enterprise and Pro plans", so being on Pro *is* the acceptance and there is
nothing to click. Verified 2026-08-29. Neon, Hostinger and Google still need
one.

**Also flagged, not counted:** Module 05's age-verification CRITICAL has nothing
to attach to — no signup, no accounts, no age-gated content. Recorded as not
applicable rather than as a pass.

---

## Authority

**Jetage Computer Traders is the Data Fiduciary**, and Ishaan Walia is both the
accountable person and the Grievance Officer — not as the site's developer, but
as someone in the business, which is what the role actually requires. A
Grievance Officer has to be able to delete a record and answer the Board for the
business; a vendor cannot.

Nothing here was blocked on anyone else's decision.

---

## Lawful basis per purpose

| Purpose | Basis used | Basis rejected | Why |
| --- | --- | --- | --- |
| Reply to a quote enquiry | **Consent** (Sec. 6) | Sec. 7(a) voluntary provision | Unambiguous and leaves evidence; see the note |
| Serving the site (request logs, IP) | Sec. 7 legitimate use | Consent | You cannot consent-gate the act of requesting a page |
| Staff logins and audit log | Employment / contract | Consent | Consent from an employee is rarely freely given |
| Cost-calculator pings | Out of scope | — | No identifier of any kind; see the inventory |

**Note on the enquiry basis.** Sec. 7(a) covers data a principal *voluntarily
provides for a specified purpose*, and a quote form is close to the paradigm
case. Consent was chosen because it is unambiguous and leaves evidence — but it
has a real cost: consent is withdrawable, and withdrawal obliges us to stop
processing and erase, so a buyer who withdraws mid-negotiation legally requires
us to delete the thread. Worth revisiting if that ever becomes a practical
problem.

---

## Scores — progress indicator only

| #   | Module                         | CRITICAL unmet | Score  | Status |
| --- | ------------------------------ | -------------- | ------ | ------ |
| 01  | Consent Management             | 0              | 8/10   | Purpose at point of collection, versioned, never pre-ticked |
| 02  | Authentication & Sessions      | 0              | 6/10   | Staff-only cookie sessions; no customer login, no OTP |
| 03  | Data Collection & Minimization | 0              | 7/10   | Inventory written; **no deletion schedule at all** |
| 04  | User Rights                    | **1**          | 7/10   | All rights honoured by email; nomination published |
| 05  | Children's Data                | n/a            | 8/10   | No tracking or ads at any age; nothing to age-verify |
| 06  | Cross-Border Transfer          | **1**          | 7/10   | Five recipients named and disclosed; **DPAs unsigned** |
| 07  | Grievance Officer              | 0              | 8/10   | Named, published, footer link, action links in the notice |
| 08  | Data Breach Response           | 0              | 7/10   | Both Rules deadlines documented; detection thin |
| 09  | Third-Party & Vendor           | 0              | 9/10   | **Zero third-party scripts** — nothing to review |
|     | **TOTAL**                      | **2**          | 67/90  | **Read the two above, not this number** |

---

## What each score rests on

### 01 · Consent — 8

`src/lib/dpdp.ts` holds `CONSENT_PURPOSE` — the exact sentence beside the
checkbox — and `CONSENT_NOTICE_VERSION`. The notice renders the same constant,
so the policy and the form cannot describe different things. Never pre-ticked;
submission is blocked with a stated reason until ticked; the enquiry email
carries the wording shown, its version and a timestamp, because with no leads
table the email is the only place a consent record can live.

**Missing two marks:** withdrawal is by email rather than one click. There is no
account to host a toggle.

### 02 · Auth — 6

Staff-only. Cookie sessions in `sessions`, password hashes in `admin_users`, no
OTP and no customer login anywhere. Nothing claimed beyond that.

### 03 · Data minimisation — 8

`docs/data-inventory.md` lists every field from the real schema and the real
forms, **including what Vercel logs on our behalf** — the row most inventories
miss.

**Missing two marks:** there is no retention schedule at all. An earlier version
of this file reported a 24-month period; **that number was invented and has been
removed** — the owner does not delete enquiries on any schedule. The notice now
says so and offers deletion on request, which is honest but is not erasure once
the purpose is served. Deciding a real period is an owner action.

### 04 · User rights — 7, one CRITICAL open

Access, correction, erasure, withdrawal and nomination are published with a
30-day commitment and **direct action links** in the notice — the Rules require a
specific communication link, not an address mentioned in prose. The Right to
Nominate is explained; most sites will not have it at all.

### 05 · Children — 8

Not directed at under-18s, dedicated section in the notice. What carries the
score is that the prohibitions hold **structurally**: nobody is tracked,
profiled or advertised to at any age, so "zero behavioural tracking of child
users" is true of every visitor rather than policed for some.

### 06 · Cross-border — 7, one CRITICAL open

`DATA_RECIPIENTS` names all five — Vercel, Neon, Hostinger, Google and WhatsApp
— with what each receives and where it sits, rendered by the notice so
disclosure cannot drift. WhatsApp is included even though the visitor sends the
message themselves, because the form pre-fills it and staying quiet about that
would be the kind of technicality nobody thanks you for.

**Missing:** DPAs. Owner action.

### 07 · Grievance Officer — 8

Named individual, published with email, WhatsApp and address, reachable from a
`Grievance` link in the footer, 30-day commitment. The checklist calls this the
most commonly missed requirement in the Act.

**Missing two marks:** no auto-acknowledgement configured, no grievance log yet.
Both are inbox configuration rather than code.

### 08 · Breach response — 7

`docs/breach-response.md` states **both** Rules deadlines — immediate
notification on becoming aware, detailed report within 72 hours — plus the four
scope questions and the escalation order. Notably it says to contact affected
people by phone or WhatsApp, because this site often has no email address for
them.

**Missing three marks:** detection is a processor telling us, or somebody
noticing. Closable now with Vercel Pro Log Drains.

### 09 · Third-party — 9

**There is nothing to review.** No Google Analytics, no Vercel Analytics, no tag
manager, no Firebase, no Segment, no advertising SDK, no session recording —
zero third-party scripts. `scripts/check-dpdp.mjs` keeps it that way: it fails
`npm run check:dpdp` if a known data-collecting dependency appears without being
declared as a recipient. It caught a real mismatch on its first run.

---

## Fixed while doing this work

**PII was being written to Vercel's logs.** `src/app/api/lead/route.tsx` called
`console.error(..., body)` when `HOSTINGER_EMAIL_PASSWORD` was unset — putting
the enquirer's name, phone number and free text into request logs that outlive
Vercel's own schedule rather than ours. A second copy of personal data nothing
tracked and nothing deleted. It now logs the form name only.

---

## Deliberate deviations

**1. No customer accounts**, so no self-serve rights portal and no one-click
withdrawal. Both counted above. Building auth to satisfy them would create a
customer database this site does not have.

**2. Cost-calculator pings are treated as out of scope** — no identifier of any
kind, fired only on an explicit button press. Disclosed in the notice anyway,
because silent collection is what erodes trust, not the data itself.

---

## What the owner has to do

None of this is code.

1. **DPAs with Neon, Hostinger and Google.** Vercel needs no action — its DPA
   applies automatically on the Pro plan.
3. **Set up Log Drains** with an expiry — closes the Module 08 detection gap and
   caps how long `clientIp` is kept.
4. **Auto-acknowledgement** on `waliaishaan17@gmail.com` for "Grievance"
   subjects, and start a grievance log.
5. **Confirm 2FA** on `info@jetageindia.in`, the Gmail that receives copies, and
   the Grievance Officer mailbox. Between them these inboxes are the only place
   customer data lives.
6. **Decide an actual retention period** for enquiry emails and keep to it.
   Nothing is deleted today; the notice admits that rather than inventing a
   figure, but "kept indefinitely" is the weakest item on this page.
7. **Get someone else to read this file.** It is self-assessed, and that is not
   evidence.
