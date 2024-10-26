"use client";

import * as z from "zod";
import { FieldValues } from "react-hook-form";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import { CODE_ITEM_TYPE, CODEITEMS_API_ENDPOINT, Label } from "@/types";
import { useUpdateLabel, useCreateLabel, fetchOneCodeItem } from "@/api";
import { Form } from "../Form";
import { Button } from "../buttons";
import { TextInput } from "../inputs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface EditCodeItemLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  label?: Pick<Label, "id" | "name" | "color">;
  editedLabel: Label | null;
}

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  color: z.string(),
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
      });

      await queryClient.invalidateQueries({
        queryKey: [CODEITEMS_API_ENDPOINT],
      });
    } finally {
      onClose();
      refetch();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      slotProps={{
        backdrop: {
          invisible: true,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {editedLabel ? "Edit label" : "Create label"}
        </Typography>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Form schema={schema} onSubmit={onSaveLabel} sx={{ height: 1 }}>
          <TextInput
            fullWidth
            label="Label Name"
            name="name"
            defaultValue={editedLabel?.name}
            required
          />

          <Typography sx={{ mt: 2, mb: 1 }}>Label Color</Typography>

          <Box>
            <TextInput
              name="color"
              type="color"
              fullWidth
              variant="standard"
              defaultValue={editedLabel?.color || label?.color || grey[100]}
              inputProps={{
                sx: {
                  height: "53.15px",
                  p: 0,
                  cursor: "pointer",
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
            isLoading={isPending || isLoadingUpdate}
          >
            Save
          </Button>
        </Form>
      </Box>
    </Modal>
  );
};
