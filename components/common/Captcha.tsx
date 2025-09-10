"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { FC, useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { isDevelopment } from "@/lib/env";

interface Props {
  onError: () => void;
  onExpire: () => void;
  onVerify: (token: string) => void;
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const Captcha: FC<Props> = (props) => {
  //#region Effects

  useEffect(() => {
    if (isDevelopment) {
      props.onVerify("dev-bypass-token");
    }
  }, []);

  //#endregion

  if (isDevelopment) {
    return <Alert variant="success">✓ CAPTCHA verification bypassed (development mode)</Alert>;
  }

  if (!siteKey) {
    return <Alert variant="destructive">CAPTCHA configuration error. Please contact support.</Alert>;
  }

  return <Turnstile siteKey={siteKey} onError={props.onError} onSuccess={props.onVerify} onExpire={props.onExpire} />;
};

export default Captcha;
