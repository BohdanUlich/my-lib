import { CATEGORIES_API_ENDPOINT, CategoriesListResponse } from "@/types";
import { fetchService } from "@/services";

interface FetchCategoriesParams {
  q?: string | null;
  page?: number;
  limit?: number;
  labels?: string[];
}

export const fetchCategories = async ({
  q,
  page = 1,
  limit = 20,
  labels,
}: FetchCategoriesParams): Promise<CategoriesListResponse> => {
  let url = `${CATEGORIES_API_ENDPOINT}?page=${page}&limit=${limit}`;

  if (q) {
    url += `&q=${encodeURIComponent(q)}`;
  }

  if (labels?.length) {
    const labelsParams = labels.map((label) => `label=${label}`).join("&");
    url += `&${labelsParams}`;
  }

  const response = await fetchService(url, { method: "GET" });

  if (!response.success) {
    throw new Error(response?.error);
  }

  return response;
};
