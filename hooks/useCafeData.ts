import { useQueryRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { cafeRepository } from "@/lib/repositories/cafe-repository";

const useCafeData = (cafeId: number) => {
  const { isLoading, data } = useQueryRequest({
    queryFn: async () => {
      const cafe = await cafeRepository.getById(cafeId);
      return cafe;
    },
    queryKey: QueryKeys.cafe(cafeId.toString()),
  });

  return { cafeSlug: data?.slug as string, isLoading, data };
};

export default useCafeData;
