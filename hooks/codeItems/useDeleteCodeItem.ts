import { useSnackbar } from "notistack";
import { fetchService } from "@/services";
import { useMutation, useQueryClient } from "react-query";
import { ApiResponse, CODEITEMS_API_ENDPOINT } from "@/types";

export const useDeleteCodeItem = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteCodeItem, isLoading } = useMutation(
    async (codeItemId: string) => {
      const response: ApiResponse<{}> = await fetchService(
        `${CODEITEMS_API_ENDPOINT}/${codeItemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      await queryClient.invalidateQueries(CODEITEMS_API_ENDPOINT);
    },
    {
      onSuccess: () => {
        enqueueSnackbar("Code-item deleted successfully", {
          variant: "success",
        });
      },
      onError: (error: Error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      },
    }
  );

  return { deleteCodeItem, isLoading };
};
