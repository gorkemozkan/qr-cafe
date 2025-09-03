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

  console.log("secretKey", secretKey);

  if (!secretKey) {
    return false;
  }

  console.log("token", token);

  if (!token) {
    return false;
  }

  const idempotencyKey = randomUUID();

  console.log("idempotencyKey", idempotencyKey);

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

      console.log("response", response);

      const data: TurnstileVerificationResponse = await response.json();

      if (response.ok) {
        if (data.success) {
          console.log("data", data);
          return true;
        } else {
          console.log("data", data);
          return false;
        }
      }

      if (attempt === maxRetries) {
        console.log("data", data);
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
