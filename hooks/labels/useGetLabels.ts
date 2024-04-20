import { fetchService } from "@/services";
import { ApiResponse, LABELS_API_ENDPOINT, Label } from "@/types";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { useGetUser } from "../useGetUser";

const fetchLabels = async (userId: string): Promise<Label[]> => {
  const urlWithQuery = `${LABELS_API_ENDPOINT}?userId=${userId}`;

  const response: ApiResponse<Label[]> = await fetchService(urlWithQuery, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};

export const useGetLabels = () => {
  const { userId } = useGetUser();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: labels,
    isLoading,
    isError,
  } = useQuery([LABELS_API_ENDPOINT, userId], () => fetchLabels(userId), {
    enabled: !!userId,
    retry: 2,
    onError: (error) =>
      enqueueSnackbar(`${error}`, {
        variant: "error",
        preventDuplicate: true,
      }),
  });

  return {
    labels: labels ?? [],
    isLoading,
    isError,
  };
};
