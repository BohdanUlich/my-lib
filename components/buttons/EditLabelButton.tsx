import { useCallback, useState } from "react";
import { ConfirmationModal, EditLabelModal, LabelsModal } from "../modals";
import { Button } from "./Button";
import { Label, LabelType } from "@/types";
import { useDeleteLabel, useGetCategories } from "@/api";

interface EditLabelButtonProps {
  categoryId: string;
  labelType: LabelType;
}

export const EditLabelButton = ({
  categoryId,
  labelType,
}: EditLabelButtonProps) => {
  const [isOpenLabelsModal, setIsOpenLabelsModal] = useState(false);
  const [isOpenEditLabelModal, setIsOpenEditLabelModal] = useState(false);
  const [isOpenDeleteLabelModal, setIsOpenDeleteLabelModal] = useState(false);
  const [editedLabel, setEditedLabel] = useState<Label | null>(null);
  const [deletedLabel, setDeletedLabel] = useState<Label | null>(null);
  const { deleteLabel, isPending } = useDeleteLabel();
  const { refetch } = useGetCategories();

  const onSetEditedLabel = (label: Label) => {
    setEditedLabel(label);
  };

  const onCloseEditedModal = () => {
    setIsOpenEditLabelModal(false);
    setEditedLabel(null);
  };

  const onDeleteLabel = useCallback((label: Label) => {
    setIsOpenDeleteLabelModal(true);
    setDeletedLabel(label);
  }, []);

  const onConfirmDeletelabel = useCallback(async () => {
    if (deletedLabel) await deleteLabel(deletedLabel.id);

    refetch();

    setIsOpenDeleteLabelModal(false);
  }, [deletedLabel, deleteLabel, refetch]);

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
        labelType={labelType}
      />

      <EditLabelModal
        isOpen={isOpenEditLabelModal}
        editedLabel={editedLabel}
        labelType={labelType}
        onClose={onCloseEditedModal}
      />

      <ConfirmationModal
        open={isOpenDeleteLabelModal}
        title={`Delete ${deletedLabel?.name}`}
        text="Are you sure you want to delete this label?"
        onClose={() => setIsOpenDeleteLabelModal(false)}
        onConfirm={onConfirmDeletelabel}
        isLoading={isPending}
        hideBackdrop
      />
    </>
  );
};
