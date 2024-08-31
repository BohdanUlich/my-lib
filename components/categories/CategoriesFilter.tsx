"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Modal, Grid, Checkbox, Typography } from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import { CATEGORY_TYPE, LABEL_QUERY_KEY, Label } from "@/types";
import { useGetLabels } from "@/api";
import { Button } from "../buttons";

export const CategoriesFilter = () => {
  const { data: labels } = useGetLabels({ labelType: CATEGORY_TYPE });
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [labelIds, setLabelIds] = useState<string[]>(
    searchParams.getAll(LABEL_QUERY_KEY)
  );
  const router = useRouter();
  const keyword = searchParams.get("q") || "";

  const onChangeLabelsFilter = ({
    label,
    checked,
  }: {
    label: Label;
    checked: boolean;
  }) => {
    let query = "/";

    if (searchParams.has("q")) {
      query = `?q=${keyword}`;
    }

    setLabelIds((prev) => {
      let currentLabelIds = [...prev];

      if (checked) {
        currentLabelIds.push(label.id);
      } else {
        currentLabelIds = prev.filter(
          (currentLabelId) => currentLabelId !== label.id
        );
      }

      if (currentLabelIds.length) {
        query =
          `?${LABEL_QUERY_KEY}=` + currentLabelIds.join(`&${LABEL_QUERY_KEY}=`);

        if (searchParams.has("q")) {
          query += `&q=${keyword}`;
        }
      }

      return currentLabelIds;
    });

    router.replace(query);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        variant="text"
        startIcon={<FilterIcon />}
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
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
          <Typography variant="h6" textAlign="center" mb={2}>
            Filters
          </Typography>

          <Typography variant="body2" fontWeight={700} mb={2}>
            Labels
          </Typography>

          <Grid container gap={2} flexDirection="column">
            {labels?.length
              ? labels.map((label) => (
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
                      checked={labelIds.includes(label.id)}
                      onChange={(e) =>
                        onChangeLabelsFilter({
                          label,
                          checked: e.target.checked,
                        })
                      }
                    />
                    <Grid
                      container
                      alignItems="center"
                      sx={{
                        bgcolor: label.color,
                        borderRadius: 1,
                        p: 1,
                        minWidth: 200,
                      }}
                    >
                      <Typography color="text.primary">{label.name}</Typography>
                    </Grid>
                  </Grid>
                ))
              : "No labels found ..."}
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};
