import {
  Modal,
  Box,
  Typography,
  IconButton,
  Checkbox,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Label, LabelType } from "@/types";
import { useCategories } from "@/providers";
import { useGetLabels, useUpdateCategory, useUpdateLabel } from "@/api";
import { Button } from "../buttons";

interface LabelsModalProps {
  isOpen: boolean;
  categoryId: string;
  labelType: LabelType;
  onClose: () => void;
  onOpenEditModal: () => void;
  onSetEditedLabel: (label: Label) => void;
  onDeleteLabel: (label: Label) => void;
}

export const LabelsModal = ({
  isOpen,
  categoryId,
  labelType,
  onClose,
  onOpenEditModal,
  onSetEditedLabel,
  onDeleteLabel,
}: LabelsModalProps) => {
  const { data: labels } = useGetLabels({ labelType });
  const { currentCategories, setCurrentCategories } = useCategories();
  const { updateLabel } = useUpdateLabel({ hideSuccessMessage: true });
  const { updateCategory } = useUpdateCategory({ hideSuccessMessage: true });

  const onEdit = (label: Label) => {
    onOpenEditModal();
    onSetEditedLabel(label);
  };

  const currentLabels =
    currentCategories.find((category) => category.id === categoryId)?.labels ||
    [];

  const onSelectLabel = ({
    checked,
    label,
  }: {
    checked: boolean;
    label: Label;
  }) => {
    // Update labels in category
    const updatedCategories = currentCategories.map((category) => {
      if (category.id !== categoryId) return category;

      const { labels = [] } = category;

      const finalLabels = checked
        ? [...labels, { ...label }]
        : labels.filter((currentLabel) => currentLabel.id !== label.id);

      updateCategory({
        id: categoryId,
        labels: finalLabels,
        name: category.name,
      });

      return { ...category, labels: finalLabels };
    });

    setCurrentCategories(updatedCategories);

    // Update category id in label
    const { category_ids: categoryIds = [] } = label;

    const finalCategoryIds = checked
      ? [...categoryIds, categoryId]
      : categoryIds.filter(
          (currenCategoryId) => currenCategoryId !== categoryId
        );

    updateLabel({ ...label, category_ids: finalCategoryIds });
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
                <Checkbox
                  edge="start"
                  checked={
                    !!currentLabels.find(
                      (currentLabel) => currentLabel.id === label.id
                    )
                  }
                  onChange={(e) =>
                    onSelectLabel({ checked: e.target.checked, label })
                  }
                />

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
