import { formatPaise } from "@/lib/money";

/**
 * Every order email — buyer and counter, placed and paid — is this one
 * component with different props.
 *
 * Same house style as `LeadNotification`: table-based layout with inline
 * styles, because that is the only markup Gmail and Outlook render
 * consistently. Flexbox, grid and `<style>` blocks are stripped or ignored by
 * enough clients that they are not worth using here.
 *
 * React escapes every interpolated string, so a buyer whose name contains an
 * angle bracket cannot rewrite the counter's copy of the order — which is the
 * other reason this belongs in JSX rather than in template strings.
 */

const FONT = "Arial, Helvetica, sans-serif";
const TEAL = "#0891b2";
const INK = "#0f172a";
const MUTED = "#5f6b7a";
const HAIRLINE = "1px solid #eef0f3";

export interface OrderEmailItem {
  name: string;
  sku: string;
  qty: number;
  lineTotalPaise: number;
}

export interface OrderEmailProps {
  heading: string;
  intro: string;
  orderNo: string;
  items: OrderEmailItem[];
  subtotalPaise: number;
  gstPaise: number;
  totalPaise: number;
  customerName: string;
  phone: string;
  address: { line1: string; line2?: string; city: string; state: string; pincode: string };
  buyerGstin?: string | null;
  ctaLabel: string;
  ctaUrl: string;
  /** Shown under the CTA when there is a tax invoice to link to. */
  invoiceUrl?: string;
}

const cell: React.CSSProperties = { fontFamily: FONT, fontSize: 14, color: INK };
const small: React.CSSProperties = { fontFamily: FONT, fontSize: 12, color: MUTED };

function TotalRow({ label, value, bold, muted }: {
  label: string; value: string; bold?: boolean; muted?: boolean;
}) {
  return (
    <tr>
      <td style={{
        ...cell,
        padding: bold ? "10px 0 0" : "3px 0",
        fontWeight: bold ? 700 : 400,
        fontSize: muted ? 12 : bold ? 16 : 14,
        color: muted ? MUTED : INK,
        borderTop: bold ? `2px solid ${INK}` : undefined,
      }}>
        {label}
      </td>
      <td align="right" style={{
        ...cell,
        padding: bold ? "10px 0 0" : "3px 0",
        fontWeight: bold ? 700 : 400,
        fontSize: muted ? 12 : bold ? 16 : 14,
        color: muted ? MUTED : INK,
        borderTop: bold ? `2px solid ${INK}` : undefined,
        whiteSpace: "nowrap",
      }}>
        {value}
      </td>
    </tr>
  );
}

export function OrderEmail(p: OrderEmailProps) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f0f2f5" }}>
        {/* Shown in the inbox list next to the subject, and nowhere else. */}
        <div style={{ display: "none", maxHeight: 0, overflow: "hidden", opacity: 0 }}>
          {`Order ${p.orderNo} — ${formatPaise(p.totalPaise)}`}
        </div>

        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td align="center" style={{ padding: "32px 16px" }}>
                <table
                  width="520"
                  cellPadding={0}
                  cellSpacing={0}
                  role="presentation"
                  style={{ backgroundColor: "#ffffff", borderRadius: 16, overflow: "hidden", maxWidth: 520 }}
                >
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor: TEAL, padding: "20px 28px" }}>
                        <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, fontFamily: FONT }}>
                          {p.heading}
                        </span>
                        <span style={{ display: "block", color: "#d8f3fa", fontSize: 13, fontFamily: FONT, marginTop: 4 }}>
                          Order {p.orderNo}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "22px 28px 6px", ...cell, lineHeight: 1.6 }}>
                        {p.intro}
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "10px 28px 0" }}>
                        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
                          <tbody>
                            {p.items.map((i, idx) => (
                              <tr key={idx}>
                                <td style={{ ...cell, padding: "10px 0", borderBottom: HAIRLINE }}>
                                  {i.name}
                                  <span style={{ ...small, display: "block", marginTop: 2 }}>
                                    {i.sku} · Qty {i.qty}
                                  </span>
                                </td>
                                <td align="right" style={{
                                  ...cell, padding: "10px 0", borderBottom: HAIRLINE,
                                  fontWeight: 600, whiteSpace: "nowrap",
                                }}>
                                  {formatPaise(i.lineTotalPaise)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "6px 28px 0" }}>
                        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
                          <tbody>
                            <TotalRow label="Subtotal" value={formatPaise(p.subtotalPaise)} />
                            <TotalRow label="Delivery" value="Free" />
                            <TotalRow label="Includes GST (18%)" value={formatPaise(p.gstPaise)} muted />
                            <TotalRow label="Total" value={formatPaise(p.totalPaise)} bold />
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "24px 28px 4px" }}>
                        {/* A table-wrapped anchor, not a styled <a>: Outlook
                            ignores padding on inline elements and the button
                            collapses to a bare link. */}
                        <table cellPadding={0} cellSpacing={0} role="presentation">
                          <tbody>
                            <tr>
                              <td style={{ backgroundColor: INK, borderRadius: 8 }}>
                                <a
                                  href={p.ctaUrl}
                                  style={{
                                    display: "inline-block", padding: "12px 22px", color: "#ffffff",
                                    fontFamily: FONT, fontSize: 14, fontWeight: 700, textDecoration: "none",
                                  }}
                                >
                                  {p.ctaLabel}
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {p.invoiceUrl && (
                          <p style={{ ...small, margin: "12px 0 0" }}>
                            <a href={p.invoiceUrl} style={{ color: TEAL }}>View your tax invoice</a>
                          </p>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "18px 28px 0" }}>
                        <span style={{ ...small, fontWeight: 700, color: INK, display: "block", marginBottom: 4 }}>
                          Delivering to
                        </span>
                        <span style={{ ...small, lineHeight: 1.7 }}>
                          {p.customerName}<br />
                          {p.address.line1}<br />
                          {p.address.line2 && <>{p.address.line2}<br /></>}
                          {p.address.city}, {p.address.state} {p.address.pincode}<br />
                          {p.phone}
                          {p.buyerGstin && <><br />GSTIN: {p.buyerGstin}</>}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td style={{
                        padding: "18px 28px", marginTop: 20, backgroundColor: "#fafbfc",
                        ...small, lineHeight: 1.6,
                      }}>
                        Jetage India · Authorized HP dealer in Chandigarh since 1989<br />
                        Keep this email — the link above is how you track this order.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
