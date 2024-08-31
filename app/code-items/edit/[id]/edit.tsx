"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { Box, Container, Typography } from "@mui/material";
import { CodeItemForm } from "@/components/code-items/CodeItemForm";
import { fetchOneCodeItem, useUpdateCodeItem } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { useProgress } from "@/providers/ProgressBarProvider";

export const EditCodeItem = () => {
  const { updateCodeItem, isPending } = useUpdateCodeItem();
  const { setLoadingProgress } = useProgress();
  const params = useParams();
  const codeItemId = `${params.id}` ?? "";

  const { data: codeItem } = useQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () => fetchOneCodeItem({ codeItemId }),
  });

  const onSubmit = async (data: FieldValues) => {
    await updateCodeItem({
      name: data.name,
      description: data.description,
      code: data.code,
      language: data.language,
      id: codeItemId,
    });
  };

  useEffect(() => {
    setLoadingProgress(false);
  }, [setLoadingProgress]);

  return (
    <Box component="main">
      <Container
        maxWidth="md"
        sx={{
          pt: 5,
          pb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          rowGap: 1.5,
        }}
      >
        <Typography variant="h3">Update code-item</Typography>
        <CodeItemForm
          onSubmit={onSubmit}
          isLoading={isPending}
          codeItem={codeItem}
        />
      </Container>
    </Box>
  );
};
