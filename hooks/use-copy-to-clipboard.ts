import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseCopyToClipboardReturn {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
  resetCopied: () => void;
}

export function useCopyToClipboard(autoResetDelay: number = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");

        if (autoResetDelay > 0) {
          setTimeout(() => setCopied(false), autoResetDelay);
        }
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        toast.error("Failed to copy to clipboard");
      }
    },
    [autoResetDelay],
  );

  const resetCopied = useCallback(() => {
    setCopied(false);
  }, []);

  return {
    copied,
    copyToClipboard,
    resetCopied,
  };
}
