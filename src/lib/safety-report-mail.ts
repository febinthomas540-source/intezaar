export type SafetyAlertResult = {
  attempted: boolean;
  sent: boolean;
  emailId?: string;
};

type SafetyAlertInput = {
  reportId: string;
  letterId: string;
  category: string;
  priority: "standard" | "high" | "critical";
  urgent: boolean;
  detailsShared: boolean;
  reportedAt: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] || character;
  });
}

export async function sendSafetyReportAlert(input: SafetyAlertInput): Promise<SafetyAlertResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.SAFETY_REPORT_EMAIL?.trim();
  if (!apiKey || !from || !to) return { attempted: false, sent: false };

  const label = input.priority.toUpperCase();
  const reportRef = input.reportId.slice(0, 8).toUpperCase();
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4ecdf;color:#40281f;font-family:Arial,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:32px 18px;">
      <div style="background:#fffaf2;border:1px solid #dfcfba;border-radius:18px;padding:28px;">
        <p style="margin:0 0 8px;color:#8f3028;font-size:12px;font-weight:700;letter-spacing:.12em;">INTEZAAR SAFETY · ${escapeHtml(label)}</p>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:500;">A recipient submitted a safety report.</h1>
        <p style="margin:20px 0 0;line-height:1.65;color:#6d5143;">This alert intentionally contains no private recipient link, decryption key or letter contents.</p>
        <div style="margin-top:22px;padding:16px;background:#f4e8d7;border-radius:10px;line-height:1.8;">
          <strong>Reference:</strong> ${escapeHtml(reportRef)}<br />
          <strong>Letter ID:</strong> ${escapeHtml(input.letterId)}<br />
          <strong>Category:</strong> ${escapeHtml(input.category)}<br />
          <strong>Priority:</strong> ${escapeHtml(input.priority)}<br />
          <strong>Immediate-risk flag:</strong> ${input.urgent ? "yes" : "no"}<br />
          <strong>Reporter supplied details:</strong> ${input.detailsShared ? "yes" : "no"}<br />
          <strong>Reported:</strong> ${escapeHtml(input.reportedAt)}
        </div>
        <p style="margin:20px 0 0;color:#81695c;font-size:13px;line-height:1.6;">Review the safety event in the private operational database. Automated triage does not make the final moderation or legal decision.</p>
      </div>
    </div>
  </body>
</html>`;

  const text = [
    `Intezaar safety report · ${label}`,
    `Reference: ${reportRef}`,
    `Letter ID: ${input.letterId}`,
    `Category: ${input.category}`,
    `Priority: ${input.priority}`,
    `Immediate-risk flag: ${input.urgent ? "yes" : "no"}`,
    `Reporter supplied details: ${input.detailsShared ? "yes" : "no"}`,
    `Reported: ${input.reportedAt}`,
    "",
    "No private recipient link, decryption key or letter contents are included in this alert.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `intezaar-safety-${input.reportId}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[${label}] Intezaar safety report ${reportRef}`,
        html,
        text,
        tags: [
          { name: "category", value: "safety_report" },
          { name: "priority", value: input.priority },
        ],
      }),
      cache: "no-store",
    });

    const result = await response.json() as { id?: string };
    return response.ok && result.id
      ? { attempted: true, sent: true, emailId: result.id }
      : { attempted: true, sent: false };
  } catch (error) {
    console.error("Safety report email alert failed:", error);
    return { attempted: true, sent: false };
  }
}
