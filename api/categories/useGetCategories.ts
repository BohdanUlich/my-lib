import { CATEGORIES_API_ENDPOINT } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchCategories } from "./fetchCategories";

export const useGetCategories = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  return useQuery({
    queryKey: [CATEGORIES_API_ENDPOINT, q],
    queryFn: () => fetchCategories({ q }),
  });
};
