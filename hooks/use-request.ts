import { toast } from "sonner";
import { ApiRouteResponse } from "@/lib/models";
import { useState, useCallback } from "react";

interface UseRequestOptions<TData> {
  fn: (...args: any[]) => Promise<ApiRouteResponse<TData>>;
  onSuccess?: (data: TData) => void;
  successMessage?: string;
  autoExecute?: boolean;
}

interface UseRequestReturn<TData, TError> {
  isLoading: boolean;
  error: TError | null;
  data: TData | null;
  execute: () => Promise<void>;
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

        if (response.success) {
          if (successMessage) {
            toast.success(successMessage);
          }

          if (response.data) {
            setData(response.data ?? null);
            onSuccess?.(response.data);
          }
        } else {
          toast.error(response.error);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);

        const finalErrorMessage = errorMessage || "An unexpected error occurred";

        toast.error(finalErrorMessage);
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
