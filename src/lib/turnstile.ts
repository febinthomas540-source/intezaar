import { randomUUID } from "node:crypto";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EXPECTED_ACTION = "post_letter";
const PRODUCTION_HOSTNAMES = new Set(["intezaar.in", "www.intezaar.in"]);

type SiteverifyResponse = {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export type TurnstileValidation = {
  success: boolean;
  reason?: string;
  skipped?: boolean;
};

function clientIp(request: Request) {
  const direct = request.headers.get("cf-connecting-ip");
  if (direct) return direct;

  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || undefined;
}

export async function validateTurnstile(
  request: Request,
  token: unknown,
): Promise<TurnstileValidation> {
  // Preview deployments and local development are not registered hostnames for
  // the production widget. Production remains fail-closed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { success: true, skipped: true };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is missing in production.");
    return { success: false, reason: "configuration" };
  }

  if (typeof token !== "string" || !token.trim() || token.length > 2048) {
    return { success: false, reason: "missing-token" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: clientIp(request),
        idempotency_key: randomUUID(),
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Turnstile Siteverify returned", response.status);
      return { success: false, reason: "siteverify-unavailable" };
    }

    const result = await response.json() as SiteverifyResponse;
    if (!result.success) {
      console.warn("Turnstile rejected letter creation:", result["error-codes"] || []);
      return { success: false, reason: "challenge-failed" };
    }

    if (result.action !== EXPECTED_ACTION) {
      console.warn("Turnstile action mismatch:", result.action);
      return { success: false, reason: "action-mismatch" };
    }

    if (!result.hostname || !PRODUCTION_HOSTNAMES.has(result.hostname)) {
      console.warn("Turnstile hostname mismatch:", result.hostname);
      return { success: false, reason: "hostname-mismatch" };
    }

    return { success: true };
  } catch (error) {
    console.error("Turnstile validation failed:", error);
    return { success: false, reason: "siteverify-error" };
  } finally {
    clearTimeout(timeout);
  }
}
