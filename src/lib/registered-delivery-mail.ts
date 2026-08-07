type RegisteredCodeEmailInput = {
  letterId: string;
  requestId: string;
  to: string;
  recipientName: string;
  code: string;
};

export type RegisteredCodeDeliveryResult = {
  sent: boolean;
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

export async function sendRegisteredVerificationCode(
  input: RegisteredCodeEmailInput,
): Promise<RegisteredCodeDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return { sent: false, message: "Verification email is not configured yet." };
  }

  const recipient = escapeHtml(input.recipientName);
  const code = escapeHtml(input.code);
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4ecdf;color:#3e291f;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;background:#f4ecdf;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fffaf2;border:1px solid #dfcfba;border-radius:20px;overflow:hidden;">
          <tr><td style="padding:20px 28px;background:#78251e;color:#fff2dc;font-size:13px;font-weight:700;letter-spacing:.14em;">INTEZAAR · REGISTERED DIGITAL MAIL</td></tr>
          <tr><td style="padding:38px 30px;">
            <p style="margin:0 0 12px;color:#9a392e;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Recipient verification</p>
            <h1 style="margin:0;color:#40281f;font-family:Georgia,serif;font-size:34px;line-height:1.08;font-weight:500;">Verification code for ${recipient}</h1>
            <p style="margin:22px 0;color:#6d5143;font-size:16px;line-height:1.65;">Enter this code on the Intezaar registered-letter screen. It expires in 10 minutes.</p>
            <div style="margin:26px 0;padding:20px;text-align:center;background:#f3e3cb;border-radius:14px;color:#64231c;font-family:Georgia,serif;font-size:38px;font-weight:700;letter-spacing:.18em;">${code}</div>
            <p style="margin:0;color:#8a7162;font-size:13px;line-height:1.55;">Do not forward this code. Intezaar will never ask you to send this code back by email.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `intezaar-registered-${input.letterId}-${input.requestId}`,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: "Your Intezaar registered-letter verification code",
        html,
        text: `Intezaar registered-letter verification code: ${input.code}\n\nThis code expires in 10 minutes. Do not forward it.`,
      }),
      cache: "no-store",
    });

    const result = await response.json() as { id?: string; message?: string };
    if (!response.ok || !result.id) {
      return { sent: false, message: result.message || "The verification email could not be sent." };
    }
    return { sent: true, emailId: result.id, message: "Verification code sent." };
  } catch (error) {
    console.error("Registered verification email failed:", error);
    return { sent: false, message: "The verification email could not be sent." };
  }
}
