import { fetchService } from "@/services";
import { ApiResponse, CATEGORIES_API_ENDPOINT, Category } from "@/types";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { useGetUser } from "../useGetUser";

const fetchCategories = async (userId: string): Promise<Category[]> => {
  const urlWithQuery = `${CATEGORIES_API_ENDPOINT}?userId=${userId}`;

  const response: ApiResponse<Category[]> = await fetchService(urlWithQuery, {
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

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery(
    [CATEGORIES_API_ENDPOINT, userId],
    () => fetchCategories(userId),
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

  return {
    categories: categories ?? [],
    isLoading,
    isError,
  };
};
