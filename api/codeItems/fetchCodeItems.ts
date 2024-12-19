import { fetchService } from "@/services";
import { CODEITEMS_API_ENDPOINT, CodeItemsListResponse } from "@/types";

interface FetchCodeItemsParams {
  q?: string | null;
  categoryId: any;
  labels?: string[];
  page?: number;
  limit?: number;
}

export const fetchCodeItems = async ({
  q,
  categoryId,
  labels,
  page = 1,
  limit = 20,
}: FetchCodeItemsParams): Promise<CodeItemsListResponse> => {
  let url = `${CODEITEMS_API_ENDPOINT}?categoryId=${categoryId}&page=${page}&limit=${limit}`;

  if (q) {
    url += `&q=${q}`;
  }

  if (labels) {
    const labelsParams = labels.map((label) => `label=${label}`).join("&");
    url += `&${labelsParams}`;
  }

  const response = await fetchService(url, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response;
};
