# Website sales — a note for the accountant

Jetage now sells online as well as over the counter. This explains what
changes for you and what does not.

**The short version: nothing about the firm changes.** Same GSTIN, same books,
same returns. The website is a second *counter*, not a second business. There
is one set of accounts and one GSTR-1, and the website sales have to end up
inside it.

---

## 1. What the website does on its own

For every online sale, at the moment the payment actually clears:

- It allocates a tax invoice number from its own series — `JI/26-27/0001`.
- It produces a complete tax invoice: both GSTINs where the buyer gave one,
  place of supply, taxable value, and CGST + SGST or IGST as appropriate.
- It emails the buyer a link to that invoice.
- It records the payment reference from Razorpay against the order.

You do not have to raise these invoices. They already exist and the customer
already has one. Your job is to get them into Tally.

## 2. Two invoice series, and why that is fine

The counter keeps using whatever series Tally issues today. The website uses
`JI/26-27/nnnn`.

Rule 46(b) asks for a consecutive serial number unique within the financial
year, **"in one or multiple series"** — so running a separate series for the
online channel is permitted, and it is much cleaner than interleaving. You
import one unbroken block of web invoice numbers per month instead of
reconciling numbers that arrive out of order from two places.

The web series restarts at `0001` every April, automatically.

**Numbers are allocated on payment, not on order.** If somebody starts a
checkout and abandons it, no number is used. That is deliberate — a gap in a
consecutive series is the thing that gets asked about.

## 3. Getting them into Tally

In the admin, go to **Orders → Sales register (CSV)**. For a specific period,
add the dates to the address:

```
/admin/orders-export?from=2026-04-01&to=2026-06-30
```

One row per invoice **line**, which is the shape Tally's import wizard expects.
The columns are:

Invoice No · Order No · Order Date · Paid Date · Status · Customer ·
Buyer GSTIN · Email · Phone · Ship City · Ship State · PIN · Place of Supply ·
Item · SKU · HSN · Qty · Rate (incl GST) · Line Total (incl GST) ·
**Taxable Value** · GST Rate · **CGST** · **SGST/UTGST** · **IGST** ·
Order Total · Payment Ref

Map it once in Tally's import wizard against your sales and tax ledgers, and
the mapping is reusable every month after that.

It is a CSV rather than Tally XML on purpose. XML has to name which sales
ledger and which tax ledgers each voucher posts to, and only you know that —
a wrong guess posts vouchers to the wrong account silently. A CSV you can also
just open and read.

## 4. Two things we need from you

**HSN codes.** The HSN column is deliberately blank. We would rather leave it
empty than print an invented code on a real tax invoice. Give us the correct
HSN per product and we will put it into the catalogue so it appears on every
future invoice.

**Confirm the GST rate.** Everything is currently treated as 18%, which we
believe is right for printers, ink, toner and computer accessories. If any
line is at a different slab, tell us and we will change it.

## 5. Prices are GST-inclusive

The price a customer sees on the website is the final amount. GST is inside
it, not added at the end, and delivery is free.

So on a ₹25,227 printer:

| | |
| --- | --- |
| Taxable value | ₹21,378.81 |
| CGST 9% | ₹1,924.10 |
| SGST/UTGST 9% | ₹1,924.09 |
| **Invoice total** | **₹25,227.00** |

The odd paise goes to CGST so the two halves add back to the exact amount
charged. The invoice always ties to the payment.

## 6. Place of supply

Taken from the delivery address and frozen onto the order on the day of sale,
so a customer editing their address later can never restate an old invoice.

- Delivered **within Chandigarh** → CGST + SGST/UTGST
- Delivered **anywhere else** → IGST

## 7. E-way bills

Required when a single consignment exceeds **₹50,000**. Most orders here are
nowhere near it — ink at ₹968, a Smart Tank at ₹11,974 — so in practice this
comes up only on a large printer or a multi-item order.

When it does, generate it the way you already do: on the portal, or from Tally
Prime, which can push it from the same voucher. The website does not generate
e-way bills and should not; that needs a GSP integration to replace something
you already do in a few clicks.

Two thresholds we have deliberately not assumed — please confirm them:
the intra-UT threshold for Chandigarh, and whether e-invoicing (IRN) applies,
which we believe it does not below ₹5 crore aggregate turnover.

## 8. Refunds

Refunded in the Razorpay dashboard, then marked Refunded in the admin. A
refunded order drops out of the sales register, so it will not sit in your
figures as a sale. If a credit note is needed, raise it in Tally as usual.

---

## Questions this note does not answer

Anything about ledger structure, how you want the vouchers grouped, or which
period you want to import on. Those are yours to decide — tell us what shape
suits you and the export can be changed to match.
