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
    return <div className="text-red-500 text-sm p-2 border border-red-200 rounded">CAPTCHA configuration error. Please contact support.</div>;
  }

  console.log("CAPTCHA component initialized", {
    siteKeyLength: siteKey.length,
    environment: process.env.NODE_ENV,
  });

  return (
    <div className="flex justify-center">
      <Turnstile
        siteKey={siteKey}
        onSuccess={(token) => {
          console.log("CAPTCHA verification success", { tokenLength: token.length });
          onVerify(token);
        }}
        onError={(error) => {
          console.error("CAPTCHA error:", error);
          onError?.();
        }}
        onExpire={() => {
          console.log("CAPTCHA expired");
          onExpire?.();
        }}
      />
    </div>
  );
}
