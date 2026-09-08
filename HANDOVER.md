# Before checkout goes live

Everything here is a decision or a credential waiting on someone, not a bug.
In the order it should be dealt with.

---

## What's left, in one place

Updated 9 Sep 2026. Everything else in this file is background.

**Blocking a real sale — nothing.** Live Razorpay keys, the webhook and the
GSTIN are all in. The next thing to happen is a test purchase.

| # | What | Whose | Why it matters |
| --- | --- | --- | --- |
| 1 | **One real test order**, then refund it | Owner | Nothing has actually been paid for yet. Buy the ₹449 M10 mouse, confirm `/admin/orders` says **Paid** — not Pending — then refund from Razorpay. Only that proves the webhook fired. |
| 2 | **HSN codes per product** | Accountant | Nothing is blocked in the code any more — there is an HSN field on every product now, and whatever is in it prints on the invoice and fills the register. What is missing is the codes themselves. Until they are entered the column shows a dash, which is honest. |
| 3 | **Confirm 18% across the catalogue** | Accountant | Everything is treated as 18%. Correct for printers, ink, toner and accessories — but he should say so. |
| 4 | **Send him `docs/ACCOUNTANT.md`** | Owner | Explains the two invoice series and the Tally import. He does not need to raise web invoices by hand. |
| 5 | **Product photography** | Owner | Data entry, not development. Upload in Products; bulk edit handles everything else. |
| 6 | **Decide on the free Gemini tier** | Owner | Free-tier chat content may be used to train Google's models. Paid tier does not. Disclosed on the site either way. |

**Known gaps, deliberately not built:**

- **Stock is not tracked.** Nothing stops someone ordering an item you do not
  have; the counter catches it on the call.
- **Refunds are manual** — Razorpay dashboard, then mark Refunded in
  `/admin/orders`. Fine at this volume.
- **No customer accounts.** Guest checkout with emailed tracking links. See §5.
- **Payments settle to a Razorpay account not registered to Jetage.** The
  owner's decision, taken knowingly. The invoice still shows Jetage's GSTIN,
  because Jetage made the sale. Tell the accountant so he books it the same
  way from the first order rather than reconstructing it in March. Switching
  later is two environment variables and a redeploy.

---

## 1. Turn Razorpay on

Checkout is live **right now in offline mode**: an order is recorded, the buyer
is told the counter will call to collect payment, and both of you get an email.
Nothing is lost — but nobody is paying online until these are set.

Set them in **Vercel → Project → Settings → Environment Variables**, not in
`.env.local`. Never paste a live secret into a chat, a commit, or a file that
git can see.

| Variable | Where it comes from |
| --- | --- |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → Account & Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Shown **once** when you generate the key. Regenerate if lost. |
| `RAZORPAY_WEBHOOK_SECRET` | You invent this. Any long random string. |
| `NEXT_PUBLIC_SITE_URL` | `https://jetageindia.in` — read at **build** time |
| `GEMINI_API_KEY` | aistudio.google.com → Get API key. Free tier is enough to start. |

Then, in the Razorpay dashboard → Settings → Webhooks:

- **URL** — `https://jetageindia.in/api/webhooks/razorpay`
- **Secret** — the same `RAZORPAY_WEBHOOK_SECRET` you just set
- **Events** — `payment.captured`, `order.paid`, `payment.failed`

Redeploy after setting the variables. Vercel does not apply them to a build
that already happened.

**These are live keys, so the first payment is real money.** The account had no
Test Mode available, so testing means buying something cheap from the site and
refunding it afterwards from Razorpay → Transactions → Refund. The M10 mouse at
₹449 is the cheapest thing in the catalogue.

### How to know it actually worked

A success message on screen proves nothing — the browser can say anything. The
order is genuinely paid when **`/admin/orders` shows it as Paid**, because only
the signature-verified webhook writes that. If checkout succeeds but the order
stays Pending, the webhook is the thing that is wrong, not the payment.

---

## 2. What the accountant needs

### The sales register

`/admin/orders` → **Sales register (CSV)**. One row per invoice line, with
dates, place of supply, taxable value, and separate CGST / SGST / IGST columns.
Add `?from=2026-04-01&to=2026-06-30` to the URL for a quarter.

It is a CSV rather than Tally XML deliberately: Tally XML has to name which
sales ledger and which tax ledgers each voucher posts to, and only the
accountant knows that. A wrong guess posts vouchers to the wrong account. They
map the CSV once in Tally's import wizard and it is reusable after that.

### Your GSTIN — done

`/order/<token>/invoice` is a full tax invoice: both GSTINs, place of supply,
taxable value, and CGST+SGST or IGST depending on where it ships.

Jetage's GSTIN — **`04AACFJ8106G1ZQ`** — is set, in `src/lib/business.ts`
alongside the address and phone rather than in an environment variable. It is
not a secret, it is printed on every invoice the firm issues, and it does not
differ between environments — so keeping it in code means the invoice cannot
break because a variable went missing.

Checked before it went in: valid check digit, state code `04` (Chandigarh,
which is what makes an intra-Chandigarh sale CGST+SGST), and PAN `AACFJ8106G`,
whose fourth character `F` confirms a partnership firm.

Buyers can enter their own GSTIN at checkout (collapsed behind a link, so
retail buyers never see it) and it appears on the invoice.

### HSN codes — needed from them

There is now an **HSN code** field on every product: in the CMS at
`/admin/products`, and as its own column in the bulk sheet. Fill it once per
product and it prints on the tax invoice and fills the HSN column of the sales
register from then on.

It is still **blank everywhere until someone types the codes in**, and that is
deliberate — a tax invoice needs the right HSN, and inventing one is worse than
leaving it out. Get them from the accountant or HP's price list.

The code is snapshotted onto the order line at the sale, the same way the name,
SKU and price are. So a reclassification later changes new invoices and leaves
old ones exactly as they were issued — and orders already placed keep their
blank column rather than retrospectively growing a code they were not sold
under.

### GST rate

Every product is treated as 18%. That is correct for printers, ink, toner and
computer accessories. If anything in the catalogue is at a different slab, say
so — it is currently a single constant in `src/lib/money.ts`.

### Invoice numbering — two series, and that is allowed

An earlier version of this file said not to start a second invoice series on
the website. **That was wrong**, and it is worth correcting because it changes
the whole workflow. Rule 46(b) requires a consecutive serial number unique
within the financial year, *"in one or multiple series"* — multiple series are
explicitly permitted.

So the site runs its own:

| | Series | Issued by |
| --- | --- | --- |
| Counter sales | whatever Tally already uses | Tally, as today |
| Website sales | `JI/26-27/0001` | the website, at payment |

The number is allocated **when Razorpay confirms payment**, never when the
order is placed — an abandoned checkout that burned a number would leave a
permanent hole in a series that has to be consecutive, and holes are what get
questioned. The financial year is in the key, so the series restarts at 0001
by itself every April.

`JI-26-000001` is still the *order* number, and it stays on the invoice
underneath, because that is what a customer quotes on the phone.

---

## 3. E-way bills — mostly not your problem

An e-way bill is required when a **single consignment exceeds ₹50,000**.

Look at what actually sells here: ink at ₹968, a Smart Tank at ₹11,974. The
overwhelming majority of retail orders are nowhere near the threshold and need
no e-way bill at all. It only comes up on a large printer, or several items
shipped together.

When it does apply:

- Generate it on **ewaybillgst.gov.in**, or straight from **Tally Prime**,
  which has e-way bill generation built in and can push from the same voucher.
- The website does not and should not generate them. Doing it from the site
  needs a GSP integration and a paid API, to replace something the accountant
  already does inside Tally in a few clicks a month.

Two thresholds worth confirming with the accountant rather than taking from
here: the **intra-state / intra-UT** threshold varies by state and Chandigarh
sets its own, and **e-invoicing (IRN)** only applies above ₹5 crore aggregate
turnover, which almost certainly does not apply yet.

---

## 4. The chat assistant

Off until `GEMINI_API_KEY` is set — the widget then tells visitors to phone
instead, which is the right failure. Get a key free at
[aistudio.google.com](https://aistudio.google.com).

It answers **only** from your live catalogue: all 47 products with current
prices, the 8 articles, and how ordering works. Edit a price in `/admin` and
the bot quotes the new one within the hour, no redeploy. It is told never to
invent a price, promise a delivery date, or claim something is in stock, and it
cannot look up or change an order.

Two knobs, both optional:

| Variable | Default | What it does |
| --- | --- | --- |
| `GEMINI_MODEL` | `gemini-3.8-flash` | Which model answers |
| `GEMINI_DAILY_CAP` | `500` | Replies per day, site-wide, before it stops |

**Read this before choosing the free tier.** Google's own pricing page says
free-tier content *may be used to improve their products* — in other words,
they can train on what your visitors type. The paid tier does not. The privacy
notice says so plainly and the widget repeats it next to the input box, but it
is your call which tier to run on, and it is a real one.

---

## 5. Customers, and why there is no login

There is no customer account, no password, and no registration step. That is a
decision, not something unfinished:

- Each order carries a 256-bit token; the confirmation email links to
  `/order/<token>`. That is how a buyer tracks it.
- `/orders` takes an email and mails links to every order at that address.
  Controlling the inbox is what a password reset proves anyway.
- `/admin/customers` groups orders by email — repeat buyers, lifetime spend,
  last order. The orders table **is** the customer record.

Adding real accounts later means a password store, a reset flow, and a
registration step between a retail buyer and paying. Worth doing only if
customers actually ask for it.

---

## 6. Don't run `npm run db:migrate`

It re-seeds the catalogue from `src/lib/data/products.ts` and would **overwrite
anything edited in the CMS**. Products are managed at `/admin/products` now.

For a schema change — a new column, an index — run `npm run db:schema`
instead. Same file, stops after the schema half, never touches a row. That is
what added the HSN columns.

---

## 7. Bulk editing the catalogue

/admin/bulk. Download the whole catalogue as .xlsx, edit it in Excel, upload it
back. All 27 fields are in the sheet — including HSN — with dropdowns for
category and status, and a How-to-use tab.

**An upload never writes anything on its own.** It produces a diff — field by
field, old value beside new — and a second, separate press applies it. That is
deliberate: one sheet with the price column shifted by a row would otherwise
reprice the whole catalogue silently.

Product images are not in the sheet and cannot be changed from it. A file path
is not something anyone can usefully type, and pasting a wrong one swaps a
photo with no warning. Pictures stay in Products, where there is an uploader
and a preview.

To add a product, add a row and leave the id blank. To hide one, set Status to
draft — deleting a row does nothing, because past orders reference it.

## 8. Still worth doing

- **Product photography and HSN codes** — data entry, not development. Both
  have a field waiting for them.
- **A test order end to end** once the live keys are in, including checking the
  confirmation email actually lands (and is not in spam).
- **Refunds** — currently done in the Razorpay dashboard, then marked Refunded
  in `/admin/orders`. Fine at this volume.
- **Stock** — the site does not track it. Nothing stops someone ordering
  something out of stock, and the counter has to catch it on the call.
