import { fetchService } from "@/services";
import { ApiResponse, LABELS_API_ENDPOINT, Label } from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";

export const useCreateLabel = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: createLabel, isLoading } = useMutation(
    async (newLabel: Pick<Label, "name" | "color" | "user_id">) => {
      const response: ApiResponse<Label> = await fetchService(
        LABELS_API_ENDPOINT,
        {
          method: "POST",
          data: newLabel,
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
        enqueueSnackbar("Label created successfully", {
          variant: "success",
        });
      },
      onError: (error: Error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      },
    }
  );

  return { createLabel, isLoading };
};
