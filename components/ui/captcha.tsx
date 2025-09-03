"use client";

import { FC } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

interface CaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

const Captcha: FC<CaptchaProps> = (props) => {
  //#region Variables

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return <div className="text-red-500 text-sm p-2 border border-red-200 rounded">CAPTCHA configuration error. Please contact support.</div>;
  }
  //#endregion

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
