import { fetchService } from "@/services";
import { ApiResponse, CodeItem, CODEITEMS_API_ENDPOINT } from "@/types";

interface FetchOneCodeItemParams {
  codeItemId: string;
  headers?: any;
}

export const fetchOneCodeItem = async ({
  codeItemId,
  headers,
}: FetchOneCodeItemParams): Promise<CodeItem> => {
  let url = `${CODEITEMS_API_ENDPOINT}/${codeItemId}`;

  const response: ApiResponse<CodeItem> = await fetchService(url, {
    method: "GET",
    headers,
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};
