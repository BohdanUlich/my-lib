import { useState } from "react";
import { Button } from "./";
import { ConfirmationModal } from "../";
import { useDeleteCategory } from "@/hooks";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

export const DeleteCategoryButton = ({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteCategory, isLoading } = useDeleteCategory();

  const onDeleteCategory = () => {
    setIsModalOpen(false);
    deleteCategory(categoryId);
  };

  return (
    <>
      <Button
        variant="contained"
        isLoading={isLoading}
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
      />
    </>
  );
};
