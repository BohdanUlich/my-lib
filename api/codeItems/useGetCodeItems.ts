import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchCodeItems } from "./fetchCodeItems";
import { CODEITEMS_API_ENDPOINT } from "@/types";

interface UseGetCodeItemsParams {
  limit?: number;
}

export const useGetCodeItems = ({ limit }: UseGetCodeItemsParams = {}) => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");
  const labels = searchParams.getAll("label");

  return useInfiniteQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, q, categoryId, labels],
    queryFn: ({ pageParam }) =>
      fetchCodeItems({ q, categoryId, labels, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (data) => {
      if (data.pagination.hasMore) {
        return data.pagination.page + 1;
      }
      return undefined;
    },
  });
};
