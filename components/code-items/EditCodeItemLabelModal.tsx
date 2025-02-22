"use client";

import * as z from "zod";
import { FieldValues } from "react-hook-form";
import { CODE_ITEM_TYPE, CODEITEMS_API_ENDPOINT, Label } from "@/types";
import { useUpdateLabel, useCreateLabel, fetchOneCodeItem } from "@/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { EditLabelModal } from "../labels";

interface EditCodeItemLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  label?: Pick<Label, "id" | "name" | "color">;
  editedLabel: Label | null;
}

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  color: z.string(),
  text_color: z.string(),
});

export const EditCodeItemLabelModal = ({
  isOpen,
  onClose,
  label,
  editedLabel,
}: EditCodeItemLabelModalProps) => {
  const { id: codeItemId } = useParams();
  const queryClient = useQueryClient();
  const { refetch } = useQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () => fetchOneCodeItem({ codeItemId: `${codeItemId}` }),
    enabled: !!codeItemId,
  });
  const { createLabel, isPending } = useCreateLabel();
  const { updateLabel, isPending: isLoadingUpdate } = useUpdateLabel();

  const onSaveLabel = async (data: FieldValues) => {
    try {
      if (editedLabel) {
        await updateLabel({
          ...editedLabel,
          name: data.name,
          color: data.color,
          text_color: data.text_color,
        });

        await queryClient.invalidateQueries({
          queryKey: [CODEITEMS_API_ENDPOINT],
        });

        return;
      }

      await createLabel({
        name: data.name,
        color: data.color,
        type: CODE_ITEM_TYPE,
        text_color: data.text_color,
      });

      await queryClient.invalidateQueries({
        queryKey: [CODEITEMS_API_ENDPOINT],
      });
    } finally {
      onClose();
      if (codeItemId) {
        refetch();
      }
    }
  };

  return (
    <EditLabelModal
      onSaveLabel={onSaveLabel}
      editedLabel={editedLabel}
      isLoadingUpdate={isLoadingUpdate}
      isOpen={isOpen}
      isPending={isPending}
      onClose={onClose}
      schema={schema}
      label={label}
    />
  );
};
