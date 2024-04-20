import { Modal, ModalProps, Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "../buttons";

interface ConfirmationModalProps extends Omit<ModalProps, "children"> {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  text?: string;
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  text,
  isLoading,
  ...rest
}: ConfirmationModalProps) => {
  return (
    <Modal open={open} onClose={onClose} {...rest}>
      <Grid
        container
        flexDirection="column"
        gap={2}
        sx={{
          p: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          maxWidth: "fit-content",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4">{title}</Typography>

        {text && <Typography variant="body1">{text}</Typography>}

        <Grid container justifyContent="end">
          <Button onClick={onClose} variant="contained" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="error"
            isLoading={isLoading}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};
