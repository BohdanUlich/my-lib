import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { FieldValues } from "react-hook-form";
import { DARK_TEXT, Label, LIGHT_TEXT } from "@/types";
import { Form } from "../Form";
import { Button } from "../buttons";
import { RadioGroupInput, TextInput } from "../inputs";
import { ZodType } from "zod";

interface LabelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  label?: { id: string; name: string; color: string };
  editedLabel: Label | null;
  schema: ZodType;
  onSaveLabel: (
    data: FieldValues
  ) => Promise<void | { error: string; details: any[] }>;
  isPending: boolean;
  isLoadingUpdate: boolean;
}

export const EditLabelModal = ({
  isOpen,
  onClose,
  label,
  editedLabel,
  schema,
  onSaveLabel,
  isPending,
  isLoadingUpdate,
}: LabelFormModalProps) => {
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

          <RadioGroupInput
            name="text_color"
            defaultValue={editedLabel?.text_color || DARK_TEXT}
            label="Text color"
            choices={[
              { value: DARK_TEXT, label: "Dark" },
              { value: LIGHT_TEXT, label: "Light" },
            ]}
            sx={{ mt: 2, "& .MuiFormGroup-root": { flexDirection: "row" } }}
          />

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
