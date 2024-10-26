import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchCodeItems } from "./fetchCodeItems";
import { CODEITEMS_API_ENDPOINT } from "@/types";

export const useGetCodeItems = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");
  const labels = searchParams.getAll("label");

  return useQuery({
    queryFn: () => fetchCodeItems({ q, categoryId, labels }),
    queryKey: [CODEITEMS_API_ENDPOINT, q, categoryId, labels],
  });
};
