import { Category, Label } from "@/types";
import { isEqual } from "lodash";

interface IsCategoryLabelsEditedParams {
  categories: Category[];
  newLabels: Label[];
  categoryId: string;
}

export const isCategoryLabelsEdited = ({
  categories,
  newLabels,
  categoryId,
}: IsCategoryLabelsEditedParams) => {
  const category = categories.find((category) => category.id === categoryId);

  if (!category) return false;

  if (!isEqual(category.labels, newLabels)) return true;

  return false;
};
