type PostedLetterEmailInput = {
  letterId: string;
  to: string;
  recipientName: string;
  senderName: string;
  occasion: string;
  recipientUrl: string;
};

export type EmailDeliveryResult = {
  attempted: boolean;
  sent: boolean;
  recipient?: string;
  message: string;
  emailId?: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] || character;
  });
}

export async function sendPostedLetterEmail(
  input: PostedLetterEmailInput,
): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return {
      attempted: false,
      sent: false,
      recipient: input.to,
      message: "Email delivery is not configured yet. The private link is still ready to share.",
    };
  }

  const recipientName = escapeHtml(input.recipientName);
  const senderName = escapeHtml(input.senderName);
  const occasion = escapeHtml(input.occasion);
  const recipientUrl = escapeHtml(input.recipientUrl);

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4ecdf;color:#3e291f;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4ecdf;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fffaf2;border:1px solid #dfcfba;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:20px 28px;background:#78251e;color:#fff2dc;font-size:13px;font-weight:700;letter-spacing:.14em;">
                INTEZAAR · PRIVATE DIGITAL MAIL
              </td>
            </tr>
            <tr>
              <td style="padding:38px 30px;">
                <p style="margin:0 0 12px;color:#9a392e;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Private mail for ${recipientName}</p>
                <h1 style="margin:0;color:#40281f;font-family:Georgia,serif;font-size:38px;line-height:1.08;font-weight:500;">A letter has been posted for you.</h1>
                <p style="margin:22px 0 0;color:#6d5143;font-size:17px;line-height:1.65;">${senderName} chose not to send these words instantly. The letter is sealed and will open only at the chosen moment.</p>
                <div style="margin:26px 0;padding:18px 20px;background:#f3e3cb;border-radius:14px;">
                  <span style="display:block;color:#9a392e;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">Occasion</span>
                  <strong style="display:block;margin-top:6px;color:#493126;font-family:Georgia,serif;font-size:20px;">${occasion}</strong>
                </div>
                <a href="${recipientUrl}" style="display:inline-block;padding:15px 24px;border-radius:999px;background:#8f281f;color:#fff8ef;text-decoration:none;font-weight:700;">Receive the sealed letter</a>
                <p style="margin:24px 0 0;color:#8a7162;font-size:13px;line-height:1.55;">Keep this private link safe. Anyone who has it may access the delivery experience. The letter body is not included in this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 30px;background:#2c1a14;color:#cbb09a;font-size:12px;line-height:1.5;">
                Intezaar is a digital letter experience, not physical postage or an emergency messaging service.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Private mail for ${input.recipientName}`,
    "",
    "A letter has been posted for you.",
    `${input.senderName} chose not to send these words instantly.`,
    `Occasion: ${input.occasion}`,
    "",
    `Receive the sealed letter: ${input.recipientUrl}`,
    "",
    "Keep this private link safe. The letter body is not included in this email.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `intezaar-posted-${input.letterId}`,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: `${input.senderName} posted a private letter for you`,
        html,
        text,
      }),
      cache: "no-store",
    });

    const result = await response.json() as { id?: string; message?: string; name?: string };
    if (!response.ok || !result.id) {
      return {
        attempted: true,
        sent: false,
        recipient: input.to,
        message: result.message || "The invitation email could not be sent. Copy the private link instead.",
      };
    }

    return {
      attempted: true,
      sent: true,
      recipient: input.to,
      emailId: result.id,
      message: `Invitation emailed to ${input.to}.`,
    };
  } catch (error) {
    console.error("Resend invitation failed:", error);
    return {
      attempted: true,
      sent: false,
      recipient: input.to,
      message: "The invitation email could not be sent. Copy the private link instead.",
    };
  }
}
