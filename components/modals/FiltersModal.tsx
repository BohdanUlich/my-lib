"use client";

import { useCallback, useState } from "react";
import { Box, Typography } from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import { Button } from "../buttons";
import { LabelsFilter } from "../labels/LabelsFilter";
import { Modal } from "../modals/Modal";
import { CATEGORY_TYPE, CODE_ITEM_TYPE, LABEL_QUERY_KEY } from "@/types";
import { useSearchParams } from "next/navigation";

interface FiltersModalProps {
  labelType: typeof CATEGORY_TYPE | typeof CODE_ITEM_TYPE;
}

export const FiltersModal = ({ labelType }: FiltersModalProps) => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [filterCounter, setFilterCounter] = useState(
    searchParams.getAll(LABEL_QUERY_KEY).length
  );

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

        <LabelsFilter
          labelType={labelType}
          setFilterCounter={setFilterCounter}
        />
      </Modal>

      {!!filterCounter && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: -5,
            height: 16,
            width: 16,
            backgroundColor: "primary.main",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 10,
            fontWeight: 500,
            color: "white",
          }}
        >
          {filterCounter}
        </Box>
      )}
    </Box>
  );
};
