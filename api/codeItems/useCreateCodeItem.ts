import { fetchService } from "@/services";
import { ApiResponse, CODEITEMS_API_ENDPOINT, CodeItem } from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCodeItem = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: createCodeItem, isPending } = useMutation({
    mutationFn: async (newCodeItem: Omit<CodeItem, "id" | "user_id">) => {
      const response: ApiResponse<CodeItem> = await fetchService(
        CODEITEMS_API_ENDPOINT,
        {
          method: "POST",
          data: newCodeItem,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      await queryClient.invalidateQueries({
        queryKey: [CODEITEMS_API_ENDPOINT],
      });

      return response.data;
    },
    onSuccess: () => {
      enqueueSnackbar("Code item created successfully", {
        variant: "success",
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  return { createCodeItem, isPending };
};
