import * as z from "zod";
import { FieldValues } from "react-hook-form";
import { CATEGORY_TYPE, Label } from "@/types";
import { useUpdateLabel, useCreateLabel, useGetCategories } from "@/api";
import { EditLabelModal } from "../labels";

interface LabelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  label?: { id: string; name: string; color: string };
  editedLabel: Label | null;
}

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  color: z.string(),
  text_color: z.string(),
});

export const EditCategoryLabelModal = ({
  isOpen,
  onClose,
  label,
  editedLabel,
}: LabelFormModalProps) => {
  const { createLabel, isPending } = useCreateLabel();
  const { updateLabel, isPending: isLoadingUpdate } = useUpdateLabel();
  const { refetch } = useGetCategories();

  const onSaveLabel = async (data: FieldValues) => {
    try {
      if (editedLabel) {
        await updateLabel({
          ...editedLabel,
          name: data.name,
          color: data.color,
          text_color: data.text_color,
        });

        return;
      }

      await createLabel({
        name: data.name,
        color: data.color,
        type: CATEGORY_TYPE,
        text_color: data.text_color,
      });
    } finally {
      onClose();
      refetch();
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
