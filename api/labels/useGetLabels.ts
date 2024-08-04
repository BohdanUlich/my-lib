import { fetchService } from "@/services";
import { ApiResponse, LABELS_API_ENDPOINT, Label, LabelType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useGetUser } from "../../hooks/useGetUser";

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

  return useQuery({
    queryFn: () => fetchLabels({ userId, labelType }),
    queryKey: [LABELS_API_ENDPOINT, userId, labelType],
    enabled: !!userId,
  });
};
