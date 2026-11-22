// ─────────────────────────────────────────────────────────────
//  Email helper — sends confirmation emails via Resend if a key is
//  configured, otherwise logs to the server console (dev-friendly).
//  SERVER-ONLY.
// ─────────────────────────────────────────────────────────────

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Dorika <onboarding@resend.dev>";

  if (!apiKey) {
    // No provider configured — log instead so nothing breaks in dev.
    console.info(`[email:disabled] → ${to} | ${subject}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return res.ok;
  } catch (err) {
    console.error("[email:error]", err);
    return false;
  }
}

export function orderConfirmationHtml(opts: {
  orderNo: string;
  name: string;
  amount?: number;
  trackUrl: string;
  kind: "order" | "custom";
}): string {
  const { orderNo, name, trackUrl, kind } = opts;
  const title = kind === "custom" ? "Custom Art Request Received" : "Order Confirmed";
  return `
  <div style="font-family:Nunito,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1C1A">
    <div style="background:#1C1C1A;padding:24px;text-align:center;border-radius:12px 12px 0 0">
      <h1 style="color:#fff;margin:0;font-size:28px">Dorika</h1>
      <p style="color:#9C4A2C;margin:4px 0 0;font-weight:bold">Crafted string art</p>
    </div>
    <div style="border:1px solid #eee;border-top:none;padding:28px;border-radius:0 0 12px 12px">
      <h2 style="margin-top:0">${title}</h2>
      <p>Hi ${name},</p>
      <p>Thank you! We've received your ${kind === "custom" ? "custom art request" : "order"}.
      Your reference number is:</p>
      <p style="font-size:24px;font-weight:bold;color:#9C4A2C;letter-spacing:1px">${orderNo}</p>
      <p>You can track the status anytime:</p>
      <p>
        <a href="${trackUrl}" style="display:inline-block;background:#9C4A2C;color:#fff;
           text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:bold">
           Track your order
        </a>
      </p>
      <p style="color:#6A6A63;font-size:14px;margin-top:28px">
        Questions? Reply to this email or WhatsApp us at +977 9708285877.
      </p>
    </div>
  </div>`;
}
