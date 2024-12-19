import { CATEGORIES_API_ENDPOINT, CategoriesListResponse } from "@/types";
import { fetchService } from "@/services";

interface FetchCategoriesParams {
  q?: string | null;
  page?: number;
  limit?: number;
}

export const fetchCategories = async ({
  q,
  page = 1,
  limit = 20,
}: FetchCategoriesParams): Promise<CategoriesListResponse> => {
  let url = `${CATEGORIES_API_ENDPOINT}?page=${page}&limit=${limit}`;

  if (q) {
    url += `&q=${encodeURIComponent(q)}`;
  }

  const response = await fetchService(url, { method: "GET" });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response;
};
