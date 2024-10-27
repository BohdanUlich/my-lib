"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Grid, Checkbox, Typography } from "@mui/material";
import { LABEL_QUERY_KEY, Label, LabelType } from "@/types";
import { useGetLabels } from "@/api";

interface LabelsFilterProps {
  labelType: LabelType;
}

export const LabelsFilter = ({ labelType }: LabelsFilterProps) => {
  const { data: labels } = useGetLabels({ labelType });
  const searchParams = useSearchParams();
  const [labelIds, setLabelIds] = useState<string[]>(
    searchParams.getAll(LABEL_QUERY_KEY)
  );
  const router = useRouter();
  const keyword = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");

  const onChangeLabelsFilter = ({
    label,
    checked,
  }: {
    label: Label;
    checked: boolean;
  }) => {
    let query = "/";

    if (keyword && categoryId) {
      query = `?q=${keyword}&categoryId=${categoryId}`;
    } else if (keyword) {
      query = `?q=${keyword}`;
    } else if (categoryId) {
      query = `?categoryId=${categoryId}`;
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

        if (keyword) {
          query += `&q=${keyword}`;
        }

        if (categoryId) {
          query += `&categoryId=${categoryId}`;
        }
      }

      return currentLabelIds;
    });

    router.replace(query);
  };

  return (
    <>
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
    </>
  );
};
