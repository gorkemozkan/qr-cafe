import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface UseRequestOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: (string | string[])[];
  optimisticUpdate?: {
    queryKey: string[];
    updateFn: (oldData: any, variables: TVariables) => any;
  };
}

interface UseRequestReturn<TData, TVariables, TError> {
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  data: TData | undefined;
  execute: (variables: TVariables) => Promise<TData | undefined>;
  reset: () => void;
}

export function useRequest<TData, TVariables = void, TError = Error>({
  mutationFn,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  invalidateQueries = [],
  optimisticUpdate,
}: UseRequestOptions<TData, TVariables>): UseRequestReturn<TData, TVariables, TError> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (successMessage) {
        toast.success(successMessage);
      }

      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey) => {
          // Handle both string and string[] query keys
          const key = Array.isArray(queryKey) ? queryKey : [queryKey];
          queryClient.invalidateQueries({ queryKey: key });
        });
      }

      onSuccess?.(data, variables);
    },
    onError: (error: Error, variables) => {
      const message = errorMessage || error.message || "An error occurred";
      toast.error(message);
      onError?.(error, variables);
    },
  });

  const execute = async (variables: TVariables): Promise<TData | undefined> => {
    try {
      if (optimisticUpdate) {
        queryClient.setQueryData(optimisticUpdate.queryKey, (oldData: any) => optimisticUpdate.updateFn(oldData, variables));
      }

      const result = await mutation.mutateAsync(variables);
      return result;
    } catch (error) {
      if (optimisticUpdate) {
        queryClient.invalidateQueries({ queryKey: optimisticUpdate.queryKey });
      }
      throw error;
    }
  };

  const reset = () => {
    mutation.reset();
  };

  return {
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as TError | null,
    data: mutation.data,
    execute,
    reset,
  };
}

export function useQueryRequest<TData, TVariables = void>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000,
  gcTime = 10 * 60 * 1000,
}: {
  queryKey: string[];
  queryFn: (variables: TVariables) => Promise<TData>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}) {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey,
    queryFn: () => queryFn({} as TVariables),
    enabled,
    staleTime,
    gcTime,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
}
