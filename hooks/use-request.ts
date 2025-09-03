import { toast } from "sonner";
import { useState, useCallback } from "react";
import type { ApiResponse } from "@/lib/api-client";

interface UseRequestOptions<TData> {
  fn: (...args: any[]) => Promise<ApiResponse<TData>>;
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
        console.log("response", response);
        if (response.success) {
          if (successMessage) {
            toast.success(successMessage);
          }

          if (response.data) {
            setData(response.data);
            onSuccess?.(response.data);
          }
        } else {
          toast.error(response.error || "An error occurred");
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
