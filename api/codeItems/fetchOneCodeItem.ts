import { fetchService } from "@/services";
import { ApiResponse, CodeItem, CODEITEMS_API_ENDPOINT } from "@/types";

interface FetchOneCodeItemParams {
  codeItemId: string;
  userId: string;
}

export const fetchOneCodeItem = async ({
  codeItemId,
  userId,
}: FetchOneCodeItemParams): Promise<CodeItem> => {
  let url = `${CODEITEMS_API_ENDPOINT}/${codeItemId}?userId=${userId}`;

  const response: ApiResponse<CodeItem> = await fetchService(url, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};
