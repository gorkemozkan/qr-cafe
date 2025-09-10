import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseCopyToClipboardReturn {
  copied: boolean;
  resetCopied: () => void;
  copyToClipboard: (text: string) => Promise<void>;
}

const useCopyToClipboard = (autoResetDelay: number = 2000): UseCopyToClipboardReturn => {
  const [copied, setCopied] = useState(false);

  const t = useTranslations("common");

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(t("copiedToClipboard"));

        if (autoResetDelay > 0) {
          setTimeout(() => setCopied(false), autoResetDelay);
        }
      } catch (_error) {
        toast.error(t("failedToCopyToClipboard"));
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
