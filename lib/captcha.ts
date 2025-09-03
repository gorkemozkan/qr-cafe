interface TurnstileVerificationResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("Turnstile secret key not found in environment variables");
    return false;
  }

  if (!token) {
    console.error("No CAPTCHA token provided");
    return false;
  }

  try {
    console.log("Verifying CAPTCHA token...", { tokenLength: token.length });

    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Turnstile API request failed:", response.status, response.statusText);
      return false;
    }

    const data: TurnstileVerificationResponse = await response.json();
    console.log("Turnstile verification response:", data);

    if (!data.success) {
      console.error("Turnstile verification failed:", {
        errorCodes: data["error-codes"],
        hostname: data.hostname,
        action: data.action,
      });
      return false;
    }

    console.log("CAPTCHA verification successful");
    return true;
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return false;
  }
}
