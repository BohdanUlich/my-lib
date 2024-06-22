import { fetchService } from "@/services";
import { ApiResponse, LABELS_API_ENDPOINT, Label, LabelType } from "@/types";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { useGetUser } from "../useGetUser";

interface UseGetLabelsParams {
  labelType: LabelType;
}

interface FetchLabelsParams extends UseGetLabelsParams {
  userId: string;
}

const fetchLabels = async ({
  userId,
  labelType,
}: FetchLabelsParams): Promise<Label[]> => {
  const urlWithQuery = `${LABELS_API_ENDPOINT}?userId=${userId}&type=${labelType}`;

  const response: ApiResponse<Label[]> = await fetchService(urlWithQuery, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};

export const useGetLabels = ({ labelType }: UseGetLabelsParams) => {
  const { userId } = useGetUser();
  const { enqueueSnackbar } = useSnackbar();

  return useQuery(
    [LABELS_API_ENDPOINT, userId, labelType],
    () => fetchLabels({ userId, labelType }),
    {
      enabled: !!userId,
      staleTime: 600000,
      retry: 2,
      onError: (error) =>
        enqueueSnackbar(`${error}`, {
          variant: "error",
          preventDuplicate: true,
        }),
    }
  );
};
