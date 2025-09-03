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

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const data: TurnstileVerificationResponse = await response.json();
    
    if (!data.success) {
      console.error("Turnstile verification failed:", data["error-codes"]);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return false;
  }
}
