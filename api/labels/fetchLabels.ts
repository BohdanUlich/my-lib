import { fetchService } from "@/services";
import { ApiResponse, Label, LABELS_API_ENDPOINT, LabelType } from "@/types";

interface FetchLabelsParams {
  labelType: LabelType;
  ids?: string[];
}

export const fetchLabels = async ({
  labelType,
  ids,
}: FetchLabelsParams): Promise<Label[]> => {
  let urlWithQuery = `${LABELS_API_ENDPOINT}?type=${labelType}`;

  if (ids && ids.length > 0) {
    const idsQuery = ids.join(",");
    urlWithQuery += `&ids=${idsQuery}`;
  }

  const response: ApiResponse<Label[]> = await fetchService(urlWithQuery, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};
