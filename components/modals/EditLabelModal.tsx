import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { Button } from "../buttons";
import { Form } from "../Form";
import { TextInput } from "../inputs";
import {
  useCreateLabel,
  useGetCategories,
  useGetUser,
  useUpdateLabel,
} from "@/hooks";
import { FieldValues } from "react-hook-form";
import * as z from "zod";
import { Label, LabelType } from "@/types";

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
  const { userId } = useGetUser();
  const { createLabel, isLoading } = useCreateLabel();
  const { updateLabel, isLoading: isLoadingUpdate } = useUpdateLabel();
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
        user_id: userId,
        type: labelType,
      });
    } finally {
      onClose();
      refetch();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} hideBackdrop>
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
            isLoading={isLoading || isLoadingUpdate}
          >
            Save
          </Button>
        </Form>
      </Box>
    </Modal>
  );
};
