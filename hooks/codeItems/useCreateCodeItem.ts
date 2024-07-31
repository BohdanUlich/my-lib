import { fetchService } from "@/services";
import { ApiResponse, CODEITEMS_API_ENDPOINT, CodeItem } from "@/types";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";

export const useCreateCodeItem = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: createCodeItem, isLoading } = useMutation(
    async (newCodeItem: Omit<CodeItem, "id">) => {
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

      await queryClient.invalidateQueries(CODEITEMS_API_ENDPOINT);

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

  return { createCodeItem, isLoading };
};
