import React, { useState } from "react";
import { grey } from "@mui/material/colors";
import { Button as MuiButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmationModal } from "@/components/modals";
import { useDeleteCodeItem } from "@/api";

interface DeleteCodeItemButtonProps {
  codeItemId: string;
  codeItemName: string;
}

export const DeleteCodeItemButton = ({
  codeItemName,
  codeItemId,
}: DeleteCodeItemButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteCodeItem, isPending } = useDeleteCodeItem();

  const onDeleteCodeItem = async () => {
    await deleteCodeItem(codeItemId);
    setIsModalOpen(false);
  };

  return (
    <>
      <MuiButton
        onClick={() => setIsModalOpen(true)}
        sx={{
          all: "unset",
          borderRadius: "50%",
        }}
      >
        <DeleteIcon
          onMouseDown={(e) => e.stopPropagation()}
          sx={{
            height: 28,
            width: 28,
            opacity: 0,
            transition: "0.1s all linear",
            borderRadius: "50%",
            padding: 0.6,
            "&:hover": {
              backgroundColor: grey[200],
            },
          }}
        />
      </MuiButton>

      <ConfirmationModal
        title={`Delete ${codeItemName}`}
        text="Are you sure you want to delete this code?"
        open={isModalOpen}
        onConfirm={onDeleteCodeItem}
        onClose={() => setIsModalOpen(false)}
        isLoading={isPending}
      />
    </>
  );
};
