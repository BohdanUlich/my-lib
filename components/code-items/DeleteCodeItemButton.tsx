"use client";

import React, { useState } from "react";
import { ButtonProps } from "@mui/material";
import { useDeleteCodeItem } from "@/api";
import { ConfirmationModal } from "../modals";
import { Button } from "../buttons";
import { useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const { push } = useRouter();

  const onDeleteCodeItem = async () => {
    await deleteCodeItem(codeItemId);
    setIsModalOpen(false);

    if (backAfterDelete) {
      push(`/code-items?categoryId=${categoryId}`);
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
