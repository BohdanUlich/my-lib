import { fetchService } from "@/services";
import { ApiResponse, CATEGORIES_API_ENDPOINT } from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";

export const useDeleteCategory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteCategory, isLoading } = useMutation(
    async (categoryId: string) => {
      const response: ApiResponse<{}> = await fetchService(
        `${CATEGORIES_API_ENDPOINT}/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      await queryClient.invalidateQueries(CATEGORIES_API_ENDPOINT);
    },
    {
      onSuccess: () => {
        enqueueSnackbar("Category deleted successfully", {
          variant: "success",
        });
      },
      onError: (error: Error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      },
    }
  );

  return { deleteCategory, isLoading };
};
