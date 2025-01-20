import * as z from "zod";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { FieldValues } from "react-hook-form";
import { Label, LabelType } from "@/types";
import { useUpdateLabel, useCreateLabel, useGetCategories } from "@/api";
import { Form } from "../Form";
import { Button } from "../buttons";
import { TextInput } from "../inputs";

interface LabelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  label?: { id: string; name: string; color: string };
  editedLabel: Label | null;
  labelType: LabelType;
}

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  color: z.string(),
});

export const EditLabelModal = ({
  isOpen,
  onClose,
  label,
  editedLabel,
  labelType,
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
        });

        return;
      }

      await createLabel({
        name: data.name,
        color: data.color,
        type: labelType,
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
                  cursor: "pointer",
                  borderRadius: 2,
                  height: 50,
                },
              }}
              sx={{
                ".MuiInputBase-root": {
                  padding: 0,
                },
                ".MuiInputBase-root::before": {
                  border: 0,
                },
                ".MuiInputBase-root::after": {
                  border: 0,
                },
                ".css-xwh72k-MuiInputBase-root-MuiInput-root:before:hover": {
                  border: 0,
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
