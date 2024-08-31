"use client";

import { useState } from "react";
import { Button } from "../buttons";
import { ConfirmationModal } from "../modals";
import { useDeleteCategory } from "@/api";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  setIsEdit: () => void;
}

export const DeleteCategoryButton = ({
  categoryId,
  categoryName,
  setIsEdit,
}: DeleteCategoryButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteCategory, isPending } = useDeleteCategory();

  const onDeleteCategory = async () => {
    await deleteCategory(categoryId);

    setIsModalOpen(false);
    setIsEdit();
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setIsModalOpen(true)}
      >
        Delete Category
      </Button>

      <ConfirmationModal
        title={`Delete ${categoryName}`}
        text="Are you sure you want to delete this category?"
        open={isModalOpen}
        onConfirm={onDeleteCategory}
        onClose={() => setIsModalOpen(false)}
        isLoading={isPending}
        hideBackdrop
      />
    </>
  );
};
