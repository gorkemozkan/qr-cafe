import { useQueryRequest } from "@/hooks/useRequest";

interface UseDataTableOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  staleTime?: number;
  gcTime?: number;
}

interface UseDataTableReturn<T> {
  data: T[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => Promise<any>;
}

export function useDataTable<T>({
  queryKey,
  queryFn,
  staleTime = 5 * 60 * 1000,
  gcTime = 10 * 60 * 1000,
}: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const { data, isLoading, refetch, isRefetching } = useQueryRequest({
    queryKey,
    queryFn,
    staleTime,
    gcTime,
  });

  return {
    data,
    isLoading,
    refetch,
    isRefetching,
  };
}
