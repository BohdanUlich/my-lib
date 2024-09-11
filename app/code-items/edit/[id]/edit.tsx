"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FieldValues } from "react-hook-form";
import { Box, Container, Grid, Typography } from "@mui/material";
import { CodeItemForm } from "@/components/code-items/CodeItemForm";
import { fetchOneCodeItem, useUpdateCodeItem } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { useProgress } from "@/providers/ProgressBarProvider";
import { Button } from "@/components";

export const EditCodeItem = () => {
  const params = useParams();
  const codeItemId = String(params.id);
  const { setLoadingProgress } = useProgress();
  const { updateCodeItem, isPending } = useUpdateCodeItem();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const categoryId = searchParams.get("categoryId");

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
      label_ids: data.label_ids,
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
        <Grid container gap={1} justifyContent="end">
          <Button onClick={() => push(`/code-items?categoryId=${categoryId}`)}>
            Back
          </Button>

          <Button
            component={Link}
            href={`/code-items/show/${codeItemId}?categoryId=${categoryId}`}
          >
            Show
          </Button>
        </Grid>

        <Typography variant="h3">Edit code item</Typography>
        <CodeItemForm
          onSubmit={onSubmit}
          isLoading={isPending}
          codeItem={codeItem}
        />
      </Container>
    </Box>
  );
};
