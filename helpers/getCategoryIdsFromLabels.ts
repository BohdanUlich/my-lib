import { Label } from "@/types";

interface GetCategoryIdsFromLabelsParams {
  labelIds: string[];
  labels: Label[];
}

export const getCategoryIdsFromLabels = ({
  labelIds,
  labels,
}: GetCategoryIdsFromLabelsParams): string[] => {
  const categoryIdsSet: Set<string> = new Set();

  labelIds.forEach((labelId) => {
    const label = labels.find((label) => label.id === labelId);

    if (label) {
      label.category_ids?.forEach((categoryId) => {
        categoryIdsSet.add(categoryId);
      });
    }
  });

  return Array.from(categoryIdsSet);
};
