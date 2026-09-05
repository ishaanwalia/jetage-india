# Before checkout goes live

Everything here is a decision or a credential waiting on someone, not a bug.
In the order it should be dealt with.

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
| `SELLER_GSTIN` | **Your own GSTIN.** No invoice can be issued without it. |

Then, in the Razorpay dashboard → Settings → Webhooks:

- **URL** — `https://jetageindia.in/api/webhooks/razorpay`
- **Secret** — the same `RAZORPAY_WEBHOOK_SECRET` you just set
- **Events** — `payment.captured`, `order.paid`, `payment.failed`

Redeploy after setting the variables. Vercel does not apply them to a build
that already happened.

**Test with Razorpay's test keys first.** They are free and permanent, and a
test payment goes through the identical code path. Card `4111 1111 1111 1111`,
any future expiry, any CVV.

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

### Your GSTIN — needed before any invoice exists

`/order/<token>/invoice` is a full tax invoice: both GSTINs, place of supply,
taxable value, and CGST+SGST or IGST depending on where it ships. It **refuses
to render** until `SELLER_GSTIN` is set, rather than producing a
confident-looking document that fails at the buyer's accountant.

Buyers can enter their own GSTIN at checkout (collapsed behind a link, so
retail buyers never see it) and it appears on the invoice.

### HSN codes — needed from them

The HSN column in the export is **empty on purpose**. A tax invoice needs the
right HSN per product, and inventing one is worse than leaving it blank. Get
the codes from the accountant or HP's price list, and they can go into each
product in the CMS once there is a field for them.

### GST rate

Every product is treated as 18%. That is correct for printers, ink, toner and
computer accessories. If anything in the catalogue is at a different slab, say
so — it is currently a single constant in `src/lib/money.ts`.

### Invoice numbering

The site issues **order** numbers (`JI-26-000001`), not tax invoice numbers.
The GST invoice series should keep coming from Tally, so there is only one
series and it stays consecutive. Do not start a second series on the website.

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

## 4. Customers, and why there is no login

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

## 5. Don't run `npm run db:migrate`

It re-seeds the catalogue from `src/lib/data/products.ts` and would **overwrite
anything edited in the CMS**. Products are managed at `/admin/products` now.

Schema changes can be applied on their own; the file is idempotent, but the
seed step is not something you want twice.

---

## 6. Still worth doing

- **Product photography and HSN** — data entry, not development.
- **A test order end to end** once the live keys are in, including checking the
  confirmation email actually lands (and is not in spam).
- **Refunds** — currently done in the Razorpay dashboard, then marked Refunded
  in `/admin/orders`. Fine at this volume.
- **Stock** — the site does not track it. Nothing stops someone ordering
  something out of stock, and the counter has to catch it on the call.
