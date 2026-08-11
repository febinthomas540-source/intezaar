export type OpenedLetterEmailResult = {
  attempted: boolean;
  sent: boolean;
  message: string;
  emailId?: string;
};

type OpenedLetterEmailInput = {
  letterId: string;
  to: string;
  senderName: string;
  recipientName: string;
  openedAt: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '\"': "&quot;",
    };
    return entities[character] || character;
  });
}

export async function sendLetterOpenedEmail(
  input: OpenedLetterEmailInput,
): Promise<OpenedLetterEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return {
      attempted: false,
      sent: false,
      message: "Opened-letter email notifications are not configured.",
    };
  }

  const senderName = escapeHtml(input.senderName || "there");
  const recipientName = escapeHtml(input.recipientName || "your recipient");
  const openedAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(input.openedAt));

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4ecdf;color:#3e291f;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4ecdf;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fffaf2;border:1px solid #dfcfba;border-radius:14px;overflow:hidden;">
          <tr><td style="padding:18px 28px;background:#78251e;color:#fff2dc;font-size:12px;font-weight:700;letter-spacing:.14em;">INTEZAAR · DELIVERY UPDATE</td></tr>
          <tr><td style="padding:36px 30px;">
            <p style="margin:0 0 12px;color:#9a392e;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">A quiet update for ${senderName}</p>
            <h1 style="margin:0;color:#40281f;font-family:Georgia,serif;font-size:36px;line-height:1.08;font-weight:500;">Your letter was opened.</h1>
            <p style="margin:22px 0 0;color:#6d5143;font-size:16px;line-height:1.65;">The Intezaar letter you posted for ${recipientName} was opened after its chosen arrival time.</p>
            <div style="margin:24px 0;padding:16px 18px;background:#f3e3cb;border-radius:10px;">
              <span style="display:block;color:#9a392e;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Opened</span>
              <strong style="display:block;margin-top:6px;color:#493126;font-size:17px;">${openedAt} UTC</strong>
            </div>
            <p style="margin:20px 0 0;color:#8a7162;font-size:13px;line-height:1.55;">This notification contains no letter text, private media or decryption key. Intezaar only records that the seal was opened.</p>
          </td></tr>
          <tr><td style="padding:17px 30px;background:#2c1a14;color:#cbb09a;font-size:12px;line-height:1.5;">You received this because you explicitly asked Intezaar to notify you when this letter was opened.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = [
    `Hi ${input.senderName || "there"},`,
    "",
    `Your Intezaar letter for ${input.recipientName || "your recipient"} was opened.`,
    `Opened at: ${openedAt} UTC`,
    "",
    "This notification contains no letter text, private media or decryption key.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `intezaar-opened-${input.letterId}`,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: "Your Intezaar letter was opened",
        html,
        text,
        tags: [
          { name: "category", value: "letter_opened" },
          { name: "letter_id", value: input.letterId.replace(/-/g, "").slice(0, 32) },
        ],
      }),
      cache: "no-store",
    });

    const result = await response.json() as { id?: string; message?: string };
    if (!response.ok || !result.id) {
      return {
        attempted: true,
        sent: false,
        message: result.message || "The opened-letter notification could not be sent.",
      };
    }

    return {
      attempted: true,
      sent: true,
      emailId: result.id,
      message: "Opened-letter notification sent.",
    };
  } catch (error) {
    console.error("Opened-letter notification failed:", error);
    return {
      attempted: true,
      sent: false,
      message: "The opened-letter notification could not be sent.",
    };
  }
}
