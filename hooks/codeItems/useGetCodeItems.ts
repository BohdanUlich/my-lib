import { fetchService } from "@/services";
import { ApiResponse, CodeItem, CODEITEMS_API_ENDPOINT } from "@/types";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { useGetUser } from "../useGetUser";
import { useSearchParams } from "next/navigation";

interface FetchCodeItemsParams {
  userId: string;
  q: string | null;
  categoryId: any;
}

const fetchCodeItems = async ({
  userId,
  q,
  categoryId,
}: FetchCodeItemsParams): Promise<CodeItem[]> => {
  let url = `${CODEITEMS_API_ENDPOINT}?userId=${userId}&categoryId=${categoryId}`;

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

export const useGetCodeItems = () => {
  const { userId } = useGetUser();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");

  return useQuery(
    ["code-items", userId, q, categoryId],
    () => fetchCodeItems({ userId, q, categoryId }),
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
