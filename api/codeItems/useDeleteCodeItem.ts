import { useSnackbar } from "notistack";
import { fetchService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, CODEITEMS_API_ENDPOINT } from "@/types";

export const useDeleteCodeItem = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteCodeItem, isPending } = useMutation({
    mutationFn: async (codeItemId: string) => {
      const response: ApiResponse<{}> = await fetchService(
        `${CODEITEMS_API_ENDPOINT}/${codeItemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      queryClient.invalidateQueries({
        queryKey: [CODEITEMS_API_ENDPOINT],
      });
    },
    onSuccess: () => {
      enqueueSnackbar("Code-item deleted successfully", {
        variant: "success",
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  return { deleteCodeItem, isPending };
};
