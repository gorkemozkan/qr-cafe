import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (shouldFetch && cafeId && !cafeSlug) {
      fetchCafe();
    }
  }, [shouldFetch, cafeId, cafeSlug, fetchCafe]);

  return { cafeSlug, isLoading, fetchCafe };
}
