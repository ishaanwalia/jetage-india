import { formatPaise } from "@/lib/money";

/**
 * The "email me my orders" message — this is the whole of the login flow, so
 * it has to read as something the recipient asked for rather than as a
 * password reset they didn't.
 *
 * Same table-and-inline-styles house style as the other two.
 */

const FONT = "Arial, Helvetica, sans-serif";
const TEAL = "#0891b2";
const INK = "#0f172a";
const MUTED = "#5f6b7a";

export interface OrderLinkRow {
  orderNo: string;
  url: string;
  totalPaise: number;
  status: string;
  createdAt: string;
}

export function OrderLinksEmail({ orders }: { orders: OrderLinkRow[] }) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f0f2f5" }}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td align="center" style={{ padding: "32px 16px" }}>
                <table
                  width="480"
                  cellPadding={0}
                  cellSpacing={0}
                  role="presentation"
                  style={{ backgroundColor: "#ffffff", borderRadius: 16, overflow: "hidden", maxWidth: 480 }}
                >
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor: TEAL, padding: "20px 28px" }}>
                        <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, fontFamily: FONT }}>
                          Your Jetage orders
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "22px 28px 8px", fontFamily: FONT, fontSize: 14, color: INK, lineHeight: 1.6 }}>
                        Every order placed with this email address. These links don&rsquo;t expire —
                        bookmark the ones you&rsquo;re watching.
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "6px 28px 0" }}>
                        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
                          <tbody>
                            {orders.map((o) => (
                              <tr key={o.orderNo}>
                                <td style={{ padding: "10px 0", borderBottom: "1px solid #eef0f3" }}>
                                  <a href={o.url} style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: INK, textDecoration: "none" }}>
                                    {o.orderNo}
                                  </a>
                                  <span style={{ display: "block", fontFamily: FONT, fontSize: 12, color: MUTED, marginTop: 2, textTransform: "capitalize" }}>
                                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                                      day: "numeric", month: "short", year: "numeric",
                                    })}{" · "}{o.status}
                                  </span>
                                </td>
                                <td align="right" style={{
                                  padding: "10px 0", borderBottom: "1px solid #eef0f3",
                                  fontFamily: FONT, fontSize: 14, fontWeight: 600, color: INK, whiteSpace: "nowrap",
                                }}>
                                  {formatPaise(o.totalPaise)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style={{
                        padding: "18px 28px", backgroundColor: "#fafbfc",
                        fontFamily: FONT, fontSize: 12, color: MUTED, lineHeight: 1.6,
                      }}>
                        Jetage India · If you didn&rsquo;t ask for this email, you can ignore it —
                        nothing has changed on your account.
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
