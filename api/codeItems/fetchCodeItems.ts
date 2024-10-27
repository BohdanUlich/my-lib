import { fetchService } from "@/services";
import { ApiResponse, CodeItem, CODEITEMS_API_ENDPOINT } from "@/types";

interface FetchCodeItemsParams {
  q?: string | null;
  categoryId: any;
  labels?: string[];
}

export const fetchCodeItems = async ({
  q,
  categoryId,
  labels,
}: FetchCodeItemsParams): Promise<CodeItem[]> => {
  let url = `${CODEITEMS_API_ENDPOINT}?categoryId=${categoryId}`;

  if (q) {
    url += `&q=${q}`;
  }

  if (labels) {
    const labelsParams = labels.map((label) => `label=${label}`).join("&");
    url += `&${labelsParams}`;
  }

  const response: ApiResponse<CodeItem[]> = await fetchService(url, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};
