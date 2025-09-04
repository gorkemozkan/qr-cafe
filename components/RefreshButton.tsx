import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  loading: boolean;
  refetch: () => void;
  maxAttempt: number;
}

const RefreshButton: FC<Props> = (props) => {
  //#region States

  const [attempt, setAttempt] = useState(0);

  //#endregion

  //#region Handlers

  const handleClick = () => {
    if (attempt < props.maxAttempt) {
      props.refetch();
      setAttempt(attempt + 1);
    }
  };

  //#endregion

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={props.loading || attempt >= props.maxAttempt}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <RefreshCcw className={cn("h-4 w-4", props.loading && "animate-spin")} />
    </Button>
  );
};

export default RefreshButton;
