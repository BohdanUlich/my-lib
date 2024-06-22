import { fetchService } from "@/services";
import { ApiResponse, CATEGORIES_API_ENDPOINT, Category } from "@/types";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { useGetUser } from "../useGetUser";
import { useSearchParams } from "next/navigation";

const fetchCategories = async ({
  userId,
  q,
}: {
  userId: string;
  q: string | null;
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
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  return useQuery(
    [CATEGORIES_API_ENDPOINT, userId, q],
    () => fetchCategories({ userId, q }),
    {
      enabled: !!userId,
      retry: 2,
      staleTime: 600000,
      onError: (error) =>
        enqueueSnackbar(`${error}`, {
          variant: "error",
          preventDuplicate: true,
        }),
    }
  );
};
