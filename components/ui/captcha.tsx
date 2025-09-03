"use client";

import { Turnstile } from "@marsidev/react-turnstile";

interface CaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  disabled?: boolean;
}

export function Captcha({ onVerify, onError, onExpire, disabled }: CaptchaProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.error("CAPTCHA site key not found in environment variables");
    return null;
  }

  return (
    <div className="flex justify-center">
      <Turnstile siteKey={siteKey} onSuccess={onVerify} onError={onError} onExpire={onExpire} />
    </div>
  );
}
