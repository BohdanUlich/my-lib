"use client";

import { Button } from "../buttons";
import { useGetLabels } from "@/api";
import { CODE_ITEM_TYPE, Label } from "@/types";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal, Box, Typography, IconButton, Grid } from "@mui/material";

interface CodeItemLabelsModalProps {
  isOpen: boolean;
  codeItemId?: string;
  onClose: () => void;
  onOpenEditModal: () => void;
  onSetEditedLabel: (label: Label) => void;
  onDeleteLabel: (label: Label) => void;
}

export const CodeItemLabelsModal = ({
  isOpen,
  onClose,
  onOpenEditModal,
  onDeleteLabel,
  onSetEditedLabel,
}: CodeItemLabelsModalProps) => {
  const labelType = CODE_ITEM_TYPE;

  const { data: labels } = useGetLabels({ labelType });

  const onEdit = (label: Label) => {
    onOpenEditModal();
    onSetEditedLabel(label);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Labels
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

        <Grid
          container
          gap={1}
          flexDirection="column"
          maxHeight={329}
          sx={{ overflowY: "auto" }}
          flexWrap="nowrap"
          pr={2}
        >
          {labels?.length ? (
            labels.map((label) => (
              <Grid
                container
                flexWrap="nowrap"
                item
                xs={12}
                key={label.id}
                gap={1}
              >
                <Grid
                  container
                  alignItems="center"
                  sx={{
                    bgcolor: label.color,
                    borderRadius: 1,
                    p: 1,
                    minWidth: 230,
                  }}
                >
                  <Typography color="text.primary">{label.name}</Typography>
                </Grid>

                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(label)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onDeleteLabel(label)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            ))
          ) : (
            <Typography>No labels found ...</Typography>
          )}
        </Grid>

        <Button variant="contained" sx={{ mt: 2 }} onClick={onOpenEditModal}>
          Create New Label
        </Button>
      </Box>
    </Modal>
  );
};
