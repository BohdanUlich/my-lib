import { useSnackbar } from "notistack";
import { fetchService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, CODEITEMS_API_ENDPOINT, CodeItem } from "@/types";

interface UseUpdateCodeItemProps {
  hideSuccessMessage?: boolean;
}

export const useUpdateCodeItem = ({
  hideSuccessMessage,
}: UseUpdateCodeItemProps = {}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: updateCodeItem, isPending } = useMutation({
    mutationFn: async (codeItem: Omit<CodeItem, "user_id" | "category_id">) => {
      const response: ApiResponse<CodeItem> = await fetchService(
        `${CODEITEMS_API_ENDPOINT}/${codeItem.id}`,
        {
          method: "PUT",
          data: codeItem,
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
      if (!hideSuccessMessage) {
        enqueueSnackbar("Code-item updated successfully", {
          variant: "success",
        });
      }
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  return { updateCodeItem, isPending };
};
