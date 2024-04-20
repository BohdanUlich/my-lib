import { fetchService } from "@/services";
import { ApiResponse, LABELS_API_ENDPOINT, Label } from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateLabel = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: updateLabel, isLoading } = useMutation(
    async (label: Label) => {
      const response: ApiResponse<Label> = await fetchService(
        `${LABELS_API_ENDPOINT}/${label.id}`,
        {
          method: "PUT",
          data: label,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      await queryClient.invalidateQueries(LABELS_API_ENDPOINT);

      return response.data;
    },
    {
      onSuccess: () => {
        enqueueSnackbar("Label updated successfully", {
          variant: "success",
        });
      },
      onError: (error: Error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      },
    }
  );

  return { updateLabel, isLoading };
};
