import { FC, ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  autoResetDelay?: number;
}

export const CopyButton: FC<CopyButtonProps> = ({ text, variant = "outline", size = "default", className, children, showIcon = true, autoResetDelay = 2000 }) => {
  const { copied, copyToClipboard } = useCopyToClipboard(autoResetDelay);

  const handleCopy = () => {
    copyToClipboard(text);
  };

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className={cn("flex items-center gap-2", className)}>
      {showIcon && (copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />)}
      {children || (copied ? "Copied!" : "Copy")}
    </Button>
  );
};
