import { CATEGORIES_API_ENDPOINT } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchCategories } from "./fetchCategories";

interface UseGetCategoriesParams {
  limit?: number;
}

export const useGetCategories = ({ limit }: UseGetCategoriesParams = {}) => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const labels = searchParams.getAll("label");

  return useInfiniteQuery({
    queryKey: [CATEGORIES_API_ENDPOINT, q, labels],
    queryFn: ({ pageParam }) =>
      fetchCategories({ q, page: pageParam, limit, labels }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};
