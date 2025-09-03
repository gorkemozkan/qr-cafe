import { randomUUID } from "node:crypto";

interface TurnstileVerificationResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
}

export async function verifyTurnstileToken(token: string, maxRetries = 3): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY not configured");
    return false;
  }

  if (!token) {
    return false;
  }

  const idempotencyKey = randomUUID();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const formData = new FormData();
      formData.append("secret", secretKey);
      formData.append("response", token);
      formData.append("idempotency_key", idempotencyKey);

      const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: formData,
      });

      const data: TurnstileVerificationResponse = await response.json();

      if (response.ok) {
        if (data.success) {
          return true;
        } else {
          console.error("Turnstile verification failed:", data["error-codes"]);
          return false;
        }
      }

      if (attempt === maxRetries) {
        console.error("Turnstile verification failed after max retries:", data["error-codes"]);
        return false;
      }

      const delay = 2 ** attempt * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (_error) {
      if (attempt === maxRetries) {
        return false;
      }

      const delay = 2 ** attempt * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return false;
}
