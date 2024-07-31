import { fetchService } from "@/services";
import { ApiResponse, CodeItem, CODEITEMS_API_ENDPOINT } from "@/types";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { useGetUser } from "../useGetUser";
import { useParams } from "next/navigation";

interface FetchCodeItemParams {
  codeItemId: any;
  userId: string;
}
const fetchCodeItems = async ({
  codeItemId,
  userId,
}: FetchCodeItemParams): Promise<CodeItem> => {
  let url = `${CODEITEMS_API_ENDPOINT}/${codeItemId}?userId=${userId}`;

  const response: ApiResponse<CodeItem> = await fetchService(url, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};

export const useGetOneCodeItem = () => {
  const { userId } = useGetUser();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { id: codeItemId } = params;

  return useQuery(
    ["code-items", codeItemId, userId],
    () => fetchCodeItems({ codeItemId, userId }),
    {
      enabled: !!userId,
      retry: 2,
      staleTime: 600000,
      onError: (error) =>
        enqueueSnackbar(`${error}`, {
          variant: "error",
          preventDuplicate: true,
        }),
    }
  );
};
