import { useCallback, useState } from "react";
import { ConfirmationModal, EditLabelModal, LabelsModal } from "../modals";
import { Button } from "./Button";
import { Label } from "@/types";
import { useDeleteLabel } from "@/hooks";

interface EditLabelButtonProps {
  categoryId: string;
}

export const EditLabelButton = ({ categoryId }: EditLabelButtonProps) => {
  const [isOpenLabelsModal, setIsOpenLabelsModal] = useState(false);
  const [isOpenEditLabelModal, setIsOpenEditLabelModal] = useState(false);
  const [isOpenDeleteLabelModal, setIsOpenDeleteLabelModal] = useState(false);
  const [editedLabel, setEditedLabel] = useState<Label | null>(null);
  const [deletedLabel, setDeletedLabel] = useState<Label | null>(null);
  const { deleteLabel, isLoading } = useDeleteLabel();

  const onSetEditedLabel = (label: Label) => {
    setEditedLabel(label);
  };

  const onDeleteLabel = useCallback((label: Label) => {
    setIsOpenDeleteLabelModal(true);
    setDeletedLabel(label);
  }, []);

  const onConfirmDeletelabel = useCallback(async () => {
    if (deletedLabel) await deleteLabel(deletedLabel.id);

    setIsOpenDeleteLabelModal(false);
  }, [deletedLabel, deleteLabel]);

  return (
    <>
      <Button variant="contained" onClick={() => setIsOpenLabelsModal(true)}>
        Edit Labels
      </Button>

      <LabelsModal
        isOpen={isOpenLabelsModal}
        categoryId={categoryId}
        onClose={() => setIsOpenLabelsModal(false)}
        onOpenEditModal={() => setIsOpenEditLabelModal(true)}
        onSetEditedLabel={onSetEditedLabel}
        onDeleteLabel={onDeleteLabel}
      />

      <EditLabelModal
        isOpen={isOpenEditLabelModal}
        onClose={() => setIsOpenEditLabelModal(false)}
        editedLabel={editedLabel}
      />

      <ConfirmationModal
        open={isOpenDeleteLabelModal}
        title={`Delete ${deletedLabel?.name}`}
        text="Are you sure you want to delete this label?"
        onClose={() => setIsOpenDeleteLabelModal(false)}
        onConfirm={onConfirmDeletelabel}
        isLoading={isLoading}
        hideBackdrop
      />
    </>
  );
};
