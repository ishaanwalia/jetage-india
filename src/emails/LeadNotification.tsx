interface LeadNotificationProps {
  name: string;
  phone: string;
  interest?: string;
  message?: string;
  source: string;
  time: string;
}

const labelStyle: React.CSSProperties = {
  padding: "10px 0",
  color: "#5f6b7a",
  fontSize: 13,
  fontFamily: "Arial, Helvetica, sans-serif",
  width: 110,
  verticalAlign: "top",
  borderBottom: "1px solid #eef0f3",
};

const valueStyle: React.CSSProperties = {
  padding: "10px 0",
  color: "#0f172a",
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "Arial, Helvetica, sans-serif",
  borderBottom: "1px solid #eef0f3",
};

// Table-based layout with inline styles — the only markup style most email
// clients (Gmail, Outlook) render consistently.
export function LeadNotification({ name, phone, interest, message, source, time }: LeadNotificationProps) {
  const rows: [string, string | undefined][] = [
    ["Name", name],
    ["Phone", phone],
    ["Interested in", interest],
    ["Notes", message],
    ["Source", source],
    ["Time", time],
  ];

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
                      <td style={{ backgroundColor: "#0891b2", padding: "20px 28px" }}>
                        <span
                          style={{
                            color: "#ffffff",
                            fontSize: 18,
                            fontWeight: 700,
                            fontFamily: "Arial, Helvetica, sans-serif",
                          }}
                        >
                          New lead — Jetage India
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 28px 4px" }}>
                        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
                          <tbody>
                            {rows
                              .filter(([, value]) => Boolean(value))
                              .map(([label, value]) => (
                                <tr key={label}>
                                  <td style={labelStyle}>{label}</td>
                                  <td style={valueStyle}>{value}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "16px 28px",
                          backgroundColor: "#fafbfc",
                          fontSize: 12,
                          color: "#8a939e",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        Sent automatically from jetageindia.in
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
