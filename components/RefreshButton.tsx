import { cn } from "@/lib/utils";
import { FC, useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  loading: boolean;
  refetch: () => void;
  maxAttempt: number;
}

const RefreshButton: FC<Props> = (props) => {
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
      return `Too many refresh attempts. Try again in ${remainingTime}s`;
    }
    if (props.loading) {
      return "Refreshing...";
    }
    return `Refresh (${attempt}/${props.maxAttempt})`;
  };

  const isBlocked = blockedUntil !== null && remainingTime > 0;

  if (isBlocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={handleClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCcw className={"h-4 w-4 "} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" onClick={handleClick} disabled={props.loading || isBlocked} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCcw className={cn("h-4 w-4", props.loading && "animate-spin")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{getTooltipText()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RefreshButton;
