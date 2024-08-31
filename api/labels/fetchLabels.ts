import { fetchService } from "@/services";
import { ApiResponse, Label, LABELS_API_ENDPOINT, LabelType } from "@/types";

interface FetchLabelsParams {
  labelType: LabelType;
}

export const fetchLabels = async ({
  labelType,
}: FetchLabelsParams): Promise<Label[]> => {
  const urlWithQuery = `${LABELS_API_ENDPOINT}?type=${labelType}`;

  const response: ApiResponse<Label[]> = await fetchService(urlWithQuery, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};
