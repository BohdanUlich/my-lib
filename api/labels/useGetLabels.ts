import { LABELS_API_ENDPOINT, LabelType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchLabels } from "./fetchLabels";

interface UseGetLabelsParams {
  labelType: LabelType;
  ids?: string[];
}

export const useGetLabels = ({ labelType, ids }: UseGetLabelsParams) => {
  return useQuery({
    queryFn: () => fetchLabels({ labelType, ids }),
    queryKey: [LABELS_API_ENDPOINT, labelType, ids],
  });
};
