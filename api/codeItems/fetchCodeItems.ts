import { fetchService } from "@/services";
import { ApiResponse, CodeItem, CODEITEMS_API_ENDPOINT } from "@/types";

interface FetchCodeItemsParams {
  q?: string | null;
  categoryId: any;
}

export const fetchCodeItems = async ({
  q,
  categoryId,
}: FetchCodeItemsParams): Promise<CodeItem[]> => {
  let url = `${CODEITEMS_API_ENDPOINT}?categoryId=${categoryId}`;

  if (q) {
    url += `&q=${q}`;
  }

  const response: ApiResponse<CodeItem[]> = await fetchService(url, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};
