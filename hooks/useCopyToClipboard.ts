import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseCopyToClipboardReturn {
  copied: boolean;
  resetCopied: () => void;
  copyToClipboard: (text: string) => Promise<void>;
}

const useCopyToClipboard = (autoResetDelay: number = 2000): UseCopyToClipboardReturn => {
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
      } catch (_error) {
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
};

export default useCopyToClipboard;
