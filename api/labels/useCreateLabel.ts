import { fetchService } from "@/services";
import { ApiResponse, LABELS_API_ENDPOINT, Label } from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLabel = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: createLabel, isPending } = useMutation({
    mutationFn: async (
      newLabel: Pick<Label, "name" | "color" | "type" | "text_color">
    ) => {
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

      await queryClient.invalidateQueries({ queryKey: [LABELS_API_ENDPOINT] });

      return response.data;
    },
    onSuccess: () => {
      enqueueSnackbar("Label created successfully", {
        variant: "success",
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  return { createLabel, isPending };
};
