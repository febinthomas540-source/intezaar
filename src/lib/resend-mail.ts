type PostedLetterEmailInput = {
  letterId: string;
  to: string;
  recipientName: string;
  senderName: string;
  occasion: string;
  recipientUrl: string;
  e2ee?: boolean;
};

type ArrivalLetterEmailInput = PostedLetterEmailInput & {
  opensAt: string;
};

export type EmailDeliveryResult = {
  attempted: boolean;
  sent: boolean;
  recipient?: string;
  message: string;
  emailId?: string;
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

function resendConfiguration(input: { to: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return {
      apiKey: "",
      from: "",
      error: {
        attempted: false,
        sent: false,
        recipient: input.to,
        message: "Email delivery is not configured yet. The private link is still ready to share.",
      } satisfies EmailDeliveryResult,
    };
  }
  return { apiKey, from, error: null };
}

function frame(content: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4ecdf;color:#3e291f;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4ecdf;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fffaf2;border:1px solid #dfcfba;border-radius:20px;overflow:hidden;">
          <tr><td style="padding:20px 28px;background:#78251e;color:#fff2dc;font-size:13px;font-weight:700;letter-spacing:.14em;">INTEZAAR · PRIVATE DIGITAL MAIL</td></tr>
          <tr><td style="padding:38px 30px;">${content}</td></tr>
          <tr><td style="padding:18px 30px;background:#2c1a14;color:#cbb09a;font-size:12px;line-height:1.5;">Intezaar is a private digital letter experience, not physical postage or an emergency messaging service.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function sendPostedLetterEmail(
  input: PostedLetterEmailInput,
): Promise<EmailDeliveryResult> {
  const configuration = resendConfiguration(input);
  if (configuration.error) return configuration.error;

  const recipientName = escapeHtml(input.recipientName);
  const recipientUrl = escapeHtml(input.recipientUrl);
  const e2eeCopy = input.e2ee
    ? "A private end-to-end encrypted Intezaar letter has been posted for you. Open the complete private link shared by the sender once on the browser you plan to use. After that, this browser can remember the private key locally so email reminders can bring you back to the same letter."
    : "A private Intezaar letter has been posted for you. Use the button below to return to the sealed delivery whenever you need it.";
  const e2eeNote = input.e2ee
    ? "The email and its return button never contain the decryption key. On a new browser or device, use the complete private link shared by the sender once before relying on email reminders."
    : "If the sender enabled recipient verification, you may be asked for a one-time code before the letter is released.";

  const html = frame(`
    <p style="margin:0 0 12px;color:#9a392e;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">A letter is waiting for ${recipientName}</p>
    <h1 style="margin:0;color:#40281f;font-family:Georgia,serif;font-size:38px;line-height:1.08;font-weight:500;">A private letter has been posted for you.</h1>
    <p style="margin:22px 0 0;color:#6d5143;font-size:17px;line-height:1.65;">${e2eeCopy}</p>
    <div style="margin:26px 0;padding:18px 20px;background:#f3e3cb;border-radius:14px;">
      <span style="display:block;color:#9a392e;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">Keep this email</span>
      <strong style="display:block;margin-top:6px;color:#493126;font-family:Georgia,serif;font-size:20px;">We will email you again when the chosen opening moment arrives.</strong>
    </div>
    <a href="${recipientUrl}" style="display:inline-block;padding:15px 24px;border-radius:8px;background:#8f281f;color:#fff8ef;text-decoration:none;font-weight:700;">View your sealed letter</a>
    <p style="margin:24px 0 0;color:#8a7162;font-size:13px;line-height:1.55;">${e2eeNote}</p>
  `);

  const text = [
    `A letter is waiting for ${input.recipientName}`,
    "",
    "A private Intezaar letter has been posted for you.",
    input.e2ee
      ? "Open the complete private link shared by the sender once on this browser. Intezaar can then remember the private key locally so later email reminders can bring you back. The key is never emailed."
      : "Use the return link below whenever you want to view the sealed delivery.",
    "",
    `View your sealed letter: ${input.recipientUrl}`,
    "",
    "Intezaar will send another email when the chosen opening moment arrives.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${configuration.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `intezaar-posted-${input.letterId}`,
      },
      body: JSON.stringify({
        from: configuration.from,
        to: [input.to],
        subject: "A private Intezaar letter is waiting for you",
        html,
        text,
        tags: [
          { name: "category", value: "letter_posted" },
          { name: "letter_id", value: input.letterId.replace(/-/g, "").slice(0, 32) },
        ],
      }),
      cache: "no-store",
    });

    const result = await response.json() as { id?: string; message?: string; name?: string };
    if (!response.ok || !result.id) {
      return {
        attempted: true,
        sent: false,
        recipient: input.to,
        message: result.message || "The delivery notice could not be sent. Copy the private link instead.",
      };
    }

    return {
      attempted: true,
      sent: true,
      recipient: input.to,
      emailId: result.id,
      message: input.e2ee
        ? `Delivery notice emailed to ${input.to}, with a safe return button and a separate opening-time reminder scheduled. The decryption key is never emailed.`
        : `Delivery notice emailed to ${input.to}.`,
    };
  } catch (error) {
    console.error("Resend delivery notice failed:", error);
    return {
      attempted: true,
      sent: false,
      recipient: input.to,
      message: "The delivery notice could not be sent. Copy the private link instead.",
    };
  }
}

export async function scheduleArrivalLetterEmail(
  input: ArrivalLetterEmailInput,
): Promise<EmailDeliveryResult> {
  const configuration = resendConfiguration(input);
  if (configuration.error) return configuration.error;

  const recipientName = escapeHtml(input.recipientName);
  const recipientUrl = escapeHtml(input.recipientUrl);
  const scheduledAt = new Date(input.opensAt);
  if (!Number.isFinite(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
    return {
      attempted: false,
      sent: false,
      recipient: input.to,
      message: "The arrival notification could not be scheduled because the opening time is invalid.",
    };
  }

  const arrivalCopy = input.e2ee
    ? "The waiting is over. If you already opened the sender's complete private link on this browser, tap below and Intezaar will return you to the letter using the key remembered locally on this device. On a new browser or device, use the sender's complete private link once."
    : "The waiting is over. The moment chosen for your private letter has arrived, and the seal can now be opened.";

  const html = frame(`
    <p style="margin:0 0 12px;color:#9a392e;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Opening-time notice for ${recipientName}</p>
    <h1 style="margin:0;color:#40281f;font-family:Georgia,serif;font-size:38px;line-height:1.08;font-weight:500;">Your Intezaar letter is ready.</h1>
    <p style="margin:22px 0;color:#6d5143;font-size:17px;line-height:1.65;">${arrivalCopy}</p>
    <a href="${recipientUrl}" style="display:inline-block;padding:15px 24px;border-radius:8px;background:#8f281f;color:#fff8ef;text-decoration:none;font-weight:700;">Open your letter</a>
    <p style="margin:24px 0 0;color:#8a7162;font-size:13px;line-height:1.55;">${input.e2ee ? "This email contains a return link, never the private decryption key. Browser recovery works only on a browser that previously received the sender's complete private link." : "If recipient verification was enabled, complete the one-time-code check before the letter is released."}</p>
  `);

  const text = [
    `Opening-time notice for ${input.recipientName}`,
    "",
    "Your Intezaar letter is ready.",
    "The waiting is over. The chosen opening moment has arrived.",
    input.e2ee
      ? "If you previously opened the complete sender-shared private link on this browser, the return link below can bring you back to the letter. On a new device, use the complete private link once."
      : "Open the private delivery link and complete recipient verification if requested.",
    "",
    `Open your letter: ${input.recipientUrl}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${configuration.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `intezaar-arrival-${input.letterId}`,
      },
      body: JSON.stringify({
        from: configuration.from,
        to: [input.to],
        subject: "Your Intezaar letter is ready to open",
        html,
        text,
        scheduled_at: scheduledAt.toISOString(),
        tags: [
          { name: "category", value: "letter_arrival" },
          { name: "letter_id", value: input.letterId.replace(/-/g, "").slice(0, 32) },
        ],
      }),
      cache: "no-store",
    });

    const result = await response.json() as { id?: string; message?: string; name?: string };
    if (!response.ok || !result.id) {
      return {
        attempted: true,
        sent: false,
        recipient: input.to,
        message: result.message || "The opening-time notification could not be scheduled.",
      };
    }

    return {
      attempted: true,
      sent: true,
      recipient: input.to,
      emailId: result.id,
      message: input.e2ee
        ? `Opening-time notification scheduled for ${input.to}, with a safe return link that can reuse a key remembered locally on the recipient's browser.`
        : `Opening-time notification scheduled for ${input.to}.`,
    };
  } catch (error) {
    console.error("Resend arrival scheduling failed:", error);
    return {
      attempted: true,
      sent: false,
      recipient: input.to,
      message: "The opening-time notification could not be scheduled.",
    };
  }
}
