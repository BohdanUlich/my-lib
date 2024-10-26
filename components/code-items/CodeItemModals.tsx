"use client";

import { useCallback, useState } from "react";
import { Label, LabelType } from "@/types";
import { useDeleteLabel } from "@/api";
import { ConfirmationModal } from "../modals/ConfirmationModal";
import { CodeItemLabelsModal } from "./CodeItemLabelsModal";
import { EditCodeItemLabelModal } from "./EditCodeItemLabelModal";

interface CodeItemModalsProps {
  codeItemId?: string;
  isEditLabelsModalOpen: boolean;
  setIsEditLabelsModalOpen: (value: boolean) => void;
  labelType: LabelType;
}

export const CodeItemModals = ({
  codeItemId,
  isEditLabelsModalOpen,
  setIsEditLabelsModalOpen,
}: CodeItemModalsProps) => {
  const [editedLabel, setEditedLabel] = useState<Label | null>(null);
  const [deletedLabel, setDeletedLabel] = useState<Label | null>(null);
  const [isOpenEditLabelModal, setIsOpenEditLabelModal] = useState(false);
  const [isOpenDeleteLabelModal, setIsOpenDeleteLabelModal] = useState(false);

  const { deleteLabel, isPending } = useDeleteLabel();

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

    setIsOpenDeleteLabelModal(false);
  }, [deletedLabel, deleteLabel]);

  return (
    <>
      <CodeItemLabelsModal
        isOpen={isEditLabelsModalOpen}
        codeItemId={codeItemId}
        onClose={() => setIsEditLabelsModalOpen(false)}
        onOpenEditModal={() => setIsOpenEditLabelModal(true)}
        onSetEditedLabel={onSetEditedLabel}
        onDeleteLabel={onDeleteLabel}
      />

      <EditCodeItemLabelModal
        isOpen={isOpenEditLabelModal}
        editedLabel={editedLabel}
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
