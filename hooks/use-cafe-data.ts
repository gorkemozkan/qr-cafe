import { cafeRepository } from "@/lib/repositories";
import { useQueryRequest } from "@/hooks/use-request";
import QueryKeys from "@/constants/query-keys";

export function useCafeData(cafeId: number) {
  const { isLoading, data } = useQueryRequest({
    queryFn: async () => {
      const cafe = await cafeRepository.getById(cafeId);
      return cafe;
    },
    queryKey: QueryKeys.cafe(cafeId.toString()),
  });

  return { cafeSlug: data?.slug as string, isLoading, data };
}
