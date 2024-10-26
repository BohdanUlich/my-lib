import { fetchService } from "@/services";
import {
  ApiResponse,
  CATEGORIES_API_ENDPOINT,
  CODEITEMS_API_ENDPOINT,
  LABELS_API_ENDPOINT,
} from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteLabel = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteLabel, isPending } = useMutation({
    mutationFn: async (labelId: string) => {
      const response: ApiResponse<{}> = await fetchService(
        `${LABELS_API_ENDPOINT}/${labelId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      await queryClient.invalidateQueries({ queryKey: [LABELS_API_ENDPOINT] });
      await queryClient.invalidateQueries({
        queryKey: [CATEGORIES_API_ENDPOINT],
      });
      await queryClient.invalidateQueries({
        queryKey: [CODEITEMS_API_ENDPOINT],
      });
    },
    onSuccess: () => {
      enqueueSnackbar("Label deleted successfully", {
        variant: "success",
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  return { deleteLabel, isPending };
};
