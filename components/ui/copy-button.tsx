import { FC, ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CopyButtonProps {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  autoResetDelay?: number;
  noText?: boolean;
}

const CopyButton: FC<CopyButtonProps> = ({
  text,
  variant = "outline",
  size = "default",
  className,
  children,
  showIcon = true,
  autoResetDelay = 2000,
  noText = false,
}) => {
  const { copied, copyToClipboard } = useCopyToClipboard(autoResetDelay);

  const handleCopy = () => {
    copyToClipboard(text);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={variant} size={size} onClick={handleCopy} className={cn("flex items-center gap-2", className)}>
          {showIcon && (copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />)}
          {children || (noText ? "" : copied ? "Copied!" : "Copy")}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy to clipboard</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CopyButton;
