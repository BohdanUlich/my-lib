import { useGetUser } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchCodeItems } from "./fetchCodeItems";
import { CODEITEMS_API_ENDPOINT } from "@/types";

export const useGetCodeItems = () => {
  const { userId } = useGetUser();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");

  return useQuery({
    queryFn: () => fetchCodeItems({ userId, q, categoryId }),
    queryKey: [CODEITEMS_API_ENDPOINT, userId, q, categoryId],
    enabled: !!userId,
  });
};
