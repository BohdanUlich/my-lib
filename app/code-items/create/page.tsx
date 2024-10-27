"use client";

import { useCreateCodeItem } from "@/api";
import { FieldValues } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Button } from "@/components/buttons";
import { CodeItemForm } from "@/components/code-items/CodeItemForm";

const CodeItemCreate = () => {
  const { back } = useRouter();
  const { createCodeItem, isPending } = useCreateCodeItem();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? "";

  const onSubmit = async (data: FieldValues) => {
    await createCodeItem({
      name: data.name,
      category_id: categoryId,
      description: data.description,
      code: data.code,
      language: data.language,
      label_ids: data.label_ids,
    });
  };

  return (
    <Box component="main">
      <Container
        maxWidth="md"
        sx={{
          pt: 5,
          pb: 3,
          rowGap: 1.5,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Grid container justifyContent="end">
          <Button onClick={back}>Back</Button>
        </Grid>

        <Typography variant="h3">Create code-item</Typography>

        <CodeItemForm onSubmit={onSubmit} isLoading={isPending} />
      </Container>
    </Box>
  );
};

export default CodeItemCreate;
