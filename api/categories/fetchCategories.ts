import { CATEGORIES_API_ENDPOINT, Category } from "@/types";
import { fetchService } from "@/services";

interface FetchCategoriesParams {
  q?: string | null;
}

export const fetchCategories = async ({
  q,
}: FetchCategoriesParams): Promise<Category[]> => {
  let url = `${CATEGORIES_API_ENDPOINT}`;

  if (q) {
    url += `?q=${q}`;
  }

  const response = await fetchService(url, { method: "GET" });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response.data;
};
