import { LABELS_API_ENDPOINT, LabelType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchLabels } from "./fetchLabels";

interface UseGetLabelsParams {
  labelType: LabelType;
}

export const useGetLabels = ({ labelType }: UseGetLabelsParams) => {
  return useQuery({
    queryFn: () => fetchLabels({ labelType }),
    queryKey: [LABELS_API_ENDPOINT, labelType],
  });
};
