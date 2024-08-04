import { fetchService } from "@/services";
import { ApiResponse, CATEGORIES_API_ENDPOINT, Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useGetUser } from "../../hooks/useGetUser";
import { useSearchParams } from "next/navigation";

export const fetchCategories = async ({
  userId,
  q,
}: {
  userId: string;
  q?: string | null;
}): Promise<Category[]> => {
  let url = `${CATEGORIES_API_ENDPOINT}?userId=${userId}`;
  if (q) {
    url += `&q=${q}`;
  }

  const response: ApiResponse<Category[]> = await fetchService(url, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};

export const useGetCategories = () => {
  const { userId } = useGetUser();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  return useQuery({
    queryKey: [CATEGORIES_API_ENDPOINT, userId, q],
    queryFn: () => fetchCategories({ userId, q }),
    enabled: !!userId,
  });
};
