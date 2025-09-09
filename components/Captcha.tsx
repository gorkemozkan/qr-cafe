"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { FC, useEffect } from "react";
import { isDevelopment } from "@/lib/env";

interface CaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

const Captcha: FC<CaptchaProps> = (props) => {
  //#region Variables

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  //#endregion

  //#region Effects

  useEffect(() => {
    if (isDevelopment) {
      props.onVerify("dev-bypass-token");
    }
  }, [props]);

  //#endregion

  if (isDevelopment) {
    return (
      <div className="text-green-600 text-xs p-2 border border-green-200 rounded bg-green-50">✓ CAPTCHA verification bypassed (development mode)</div>
    );
  }

  if (!siteKey) {
    return <div className="text-red-500 text-sm p-2 border border-red-200 rounded">CAPTCHA configuration error. Please contact support.</div>;
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={(token) => {
        props.onVerify(token);
      }}
      onError={() => {
        props.onError?.();
      }}
      onExpire={() => {
        props.onExpire?.();
      }}
    />
  );
};

export default Captcha;
