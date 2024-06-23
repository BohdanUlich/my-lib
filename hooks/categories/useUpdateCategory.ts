import { fetchService } from "@/services";
import { ApiResponse, CATEGORIES_API_ENDPOINT, Category } from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";

interface UseUpdateCategoryProps {
  hideSuccessMessage?: boolean;
}

export const useUpdateCategory = ({
  hideSuccessMessage,
}: UseUpdateCategoryProps = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: updateCategory, isLoading } = useMutation(
    async (category: Category) => {
      const response: ApiResponse<Category> = await fetchService(
        `${CATEGORIES_API_ENDPOINT}/${category.id}`,
        {
          method: "PUT",
          data: category,
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
        if (!hideSuccessMessage) {
          enqueueSnackbar("Category updated successfully", {
            variant: "success",
          });
        }
      },
      onError: (error: Error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      },
    }
  );

  return { updateCategory, isLoading };
};
