import { Modal, ModalProps, Grid2, Box } from "@mui/material";
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
    <Modal
      open={open}
      onClose={onClose}
      {...rest}
      slotProps={{
        backdrop: {
          onMouseDown: (e) => {
            e.stopPropagation();
          },
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          p: 2,
          position: "absolute",
          boxShadow: 24,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          maxWidth: "fit-content",
          borderRadius: 2,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Typography
          variant="h4"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 5,
            overflow: "hidden",
            wordBreak: "break-all",
          }}
        >
          {title}
        </Typography>

        {text && <Typography variant="body1">{text}</Typography>}

        <Grid2 container justifyContent="end" flexWrap="nowrap">
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
        </Grid2>
      </Box>
    </Modal>
  );
};
