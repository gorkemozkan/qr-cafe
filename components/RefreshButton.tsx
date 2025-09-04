import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  loading: boolean;
  refetch: () => void;
  maxAttempt: number;
}

const RefreshButton: FC<Props> = (props) => {
  //#region Cookie Helpers

  //#endregion

  //#region States

  const [attempt, setAttempt] = useState(0);

  //#endregion

  //#region Effects

  //#endregion

  //#region Handlers

  const handleClick = () => {
    if (attempt < props.maxAttempt) {
      props.refetch();
      const newAttempt = attempt + 1;
      setAttempt(newAttempt);
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
