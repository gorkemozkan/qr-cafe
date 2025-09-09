import { randomUUID } from "node:crypto";
import { isDevelopment } from "@/lib/env";

interface TurnstileVerificationResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
}

export const verifyTurnstileToken = async (token: string, maxRetries = 3): Promise<boolean> => {
  if (isDevelopment) {
    return true;
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
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
          return false;
        }
      }

      if (attempt === maxRetries) {
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
};
