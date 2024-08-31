"use client";

import React, { useState } from "react";
import { ButtonProps } from "@mui/material";
import { useDeleteCodeItem } from "@/api";
import { ConfirmationModal } from "../modals";
import { Button } from "../buttons";
import { useRouter } from "next/navigation";

interface DeleteCodeItemButtonProps extends ButtonProps {
  codeItemId: string;
  codeItemName: string;
  backAfterDelete?: boolean;
}

export const DeleteCodeItemButton = ({
  codeItemName,
  codeItemId,
  backAfterDelete,
  children,
  ...rest
}: DeleteCodeItemButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteCodeItem, isPending } = useDeleteCodeItem();

  const { back } = useRouter();

  const onDeleteCodeItem = async () => {
    await deleteCodeItem(codeItemId);
    setIsModalOpen(false);

    if (backAfterDelete) {
      back();
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} {...rest}>
        {children}
      </Button>

      <ConfirmationModal
        title={`Delete ${codeItemName}`}
        text="Are you sure you want to delete this code item?"
        open={isModalOpen}
        onConfirm={onDeleteCodeItem}
        onClose={() => setIsModalOpen(false)}
        isLoading={isPending}
      />
    </>
  );
};
