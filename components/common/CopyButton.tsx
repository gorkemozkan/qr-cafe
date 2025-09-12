import { Check, Copy } from "lucide-react";
import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  children?: ReactNode;
}

const AUTO_RESET_DELAY = 2000;

const CopyButton: FC<Props> = (props) => {
  const { copied, copyToClipboard } = useCopyToClipboard(AUTO_RESET_DELAY);

  const handleCopy = () => {
    copyToClipboard(props.text);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className={cn("flex items-center gap-2", props.className)}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};

export default CopyButton;
