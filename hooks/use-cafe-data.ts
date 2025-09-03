import { useState, useEffect, useCallback } from "react";
import { cafeRepository } from "@/lib/repositories";
import { useRequest } from "@/hooks/use-request";

export function useCafeData(cafeId: number, shouldFetch: boolean) {
  const [cafeSlug, setCafeSlug] = useState<string>("");

  const { isLoading, execute: fetchCafe } = useRequest({
    mutationFn: async () => {
      const cafe = await cafeRepository.getById(cafeId);
      return cafe;
    },
    onSuccess: (cafe) => {
      setCafeSlug(cafe.slug);
    },
  });

  // Memoize the fetch function to prevent infinite re-renders
  const memoizedFetchCafe = useCallback(() => {
    fetchCafe();
  }, [fetchCafe]);

  useEffect(() => {
    if (shouldFetch && cafeId && !cafeSlug) {
      memoizedFetchCafe();
    }
  }, [shouldFetch, cafeId, cafeSlug, memoizedFetchCafe]);

  return { cafeSlug, isLoading, fetchCafe: memoizedFetchCafe };
}
