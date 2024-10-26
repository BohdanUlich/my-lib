"use client";

import { useCallback, useState } from "react";
import { Box, Typography } from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import { Button } from "../buttons";
import { LabelsFilter } from "../labels/LabelsFilter";
import { Modal } from "../modals/Modal";
import { CATEGORY_TYPE } from "@/types";

export const CategoriesFilterModal = () => {
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        variant="text"
        startIcon={<FilterIcon />}
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>

      <Modal open={open} onClose={onClose}>
        <Typography variant="h6" textAlign="center" mb={2}>
          Filters
        </Typography>

        <LabelsFilter labelType={CATEGORY_TYPE} />
      </Modal>
    </Box>
  );
};
