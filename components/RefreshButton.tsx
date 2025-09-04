import { cn } from "@/lib/utils";
import { FC, useState, useEffect, useCallback } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  loading: boolean;
  refetch: () => void;
  maxAttempt: number;
  cookieKey?: string; // Optional unique key for cookie storage
}

const RefreshButton: FC<Props> = (props) => {
  //#region Cookie Helpers

  const getCookieKey = useCallback(() => {
    return `refresh_attempt_${props.cookieKey || "default"}`;
  }, [props.cookieKey]);

  const getAttemptFromCookie = useCallback((): number => {
    if (typeof document === "undefined") return 0;
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${getCookieKey()}=`))
      ?.split("=")[1];
    return value ? parseInt(value, 10) : 0;
  }, [getCookieKey]);

  const setAttemptToCookie = useCallback(
    (value: number) => {
      if (typeof document === "undefined") return;
      const expires = new Date();
      expires.setTime(expires.getTime() + 5 * 60 * 1000); // 5 minutes
      // biome-ignore lint/suspicious/noDocumentCookie: Direct assignment to document.cookie is intentional for simple cookie management
      document.cookie = `${getCookieKey()}=${value}; expires=${expires.toUTCString()}; path=/`;
    },
    [getCookieKey],
  );

  //#endregion

  //#region States

  const [attempt, setAttempt] = useState(0);

  //#endregion

  //#region Effects

  useEffect(() => {
    // Load attempt count from cookie on mount
    const savedAttempt = getAttemptFromCookie();
    setAttempt(savedAttempt);
  }, [getAttemptFromCookie]);

  //#endregion

  //#region Handlers

  const handleClick = () => {
    if (attempt < props.maxAttempt) {
      props.refetch();
      const newAttempt = attempt + 1;
      setAttempt(newAttempt);
      setAttemptToCookie(newAttempt);
    }
  };

  //#endregion

  const getTooltipText = () => {
    if (attempt >= props.maxAttempt) {
      return "Maximum refresh attempts reached";
    }
    if (props.loading) {
      return "Refreshing...";
    }
    return `Instant refresh (${attempt}/${props.maxAttempt} attempts used)`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={handleClick}
          disabled={props.loading || attempt >= props.maxAttempt}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
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
