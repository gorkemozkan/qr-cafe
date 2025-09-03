import { toast } from "sonner";
import { useState, useCallback } from "react";

interface UseRequestOptions<TData> {
  fn: (...args: any[]) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  successMessage?: string;
  autoExecute?: boolean;
}

interface UseRequestReturn<TData, TError> {
  isLoading: boolean;
  error: TError | null;
  data: TData | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useRequest<TData, TError = string>({ fn, onSuccess, successMessage }: UseRequestOptions<TData>): UseRequestReturn<TData, TError> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TError | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fn(...args);

        if (successMessage) {
          toast.success(successMessage);
        }

        setData(response);
        onSuccess?.(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        toast.error(errorMessage);
        setError(errorMessage as TError);
      } finally {
        setIsLoading(false);
      }
    },
    [fn, onSuccess, successMessage],
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
  };
}
