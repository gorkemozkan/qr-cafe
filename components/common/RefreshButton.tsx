"use client";

import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import TooltipButton from "@/components/common/TooltipButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  loading: boolean;
  refetch: () => void;
  maxAttempt: number;
}

const RefreshButton: FC<Props> = (props) => {
  //#region Hooks

  const tCommon = useTranslations("common");

  //#endregion

  //#region States

  const [attempt, setAttempt] = useState(0);

  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);

  const [remainingTime, setRemainingTime] = useState(0);

  //#endregion

  //#region Effects

  useEffect(() => {
    if (!blockedUntil) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((blockedUntil - now) / 1000));

      setRemainingTime(remaining);

      if (remaining === 0) {
        setBlockedUntil(null);
        setAttempt(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  //#endregion

  //#region Handlers

  const handleClick = () => {
    if (blockedUntil || attempt >= props.maxAttempt) return;

    props.refetch();
    const newAttempt = attempt + 1;
    setAttempt(newAttempt);

    if (newAttempt >= props.maxAttempt) {
      const blockTime = Date.now() + 45000;
      setBlockedUntil(blockTime);
      setRemainingTime(45);
    }
  };

  //#endregion

  const getTooltipText = () => {
    if (blockedUntil && remainingTime > 0) {
      return tCommon("refresh.tooManyAttempts", { remainingTime });
    }
    if (props.loading) {
      return tCommon("refresh.refreshing");
    }
    return tCommon("refresh.refresh", { attempt, maxAttempt: props.maxAttempt });
  };

  const isBlocked = blockedUntil !== null && remainingTime > 0;

  if (isBlocked) {
    return (
      <TooltipButton onClick={handleClick} tooltip={getTooltipText()}>
        <Button variant="outline" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </TooltipButton>
    );
  }

  return (
    <TooltipButton onClick={handleClick} tooltip={getTooltipText()}>
      <Button size={"lg"} variant="outline" disabled={props.loading || isBlocked} className="text-sm">
        <RefreshCcw className={cn("h-4 w-4", props.loading && "animate-spin")} />{" "}
      </Button>
    </TooltipButton>
  );
};

export default RefreshButton;
