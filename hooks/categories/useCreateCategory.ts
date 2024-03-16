import { fetchService } from "@/services";
import { ApiResponse, CATEGORIES_API_ENDPOINT, Category } from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";

export const useCreateCategory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: createCategory, isLoading } = useMutation(
    async (newCategory: Omit<Category, "id">) => {
      const response: ApiResponse<Category> = await fetchService(
        CATEGORIES_API_ENDPOINT,
        {
          method: "POST",
          data: newCategory,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      await queryClient.invalidateQueries(CATEGORIES_API_ENDPOINT);

      return response.data;
    },
    {
      onSuccess: () => {
        enqueueSnackbar("Category created successfully", {
          variant: "success",
        });
      },
      onError: (error: Error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      },
    }
  );

  return { createCategory, isLoading };
};
