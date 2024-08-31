"use client";

import { CodeItemForm } from "@/components/code-items/CodeItemForm";
import { FieldValues } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import { useCreateCodeItem } from "@/api";

const CodeItemCreate = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? "";
  const { createCodeItem, isPending } = useCreateCodeItem();

  const onSubmit = async (data: FieldValues) => {
    await createCodeItem({
      name: data.name,
      category_id: categoryId,
      description: data.description,
      code: data.code,
      language: data.language,
    });
  };

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
        <Typography variant="h3">Create code-item</Typography>
        <CodeItemForm onSubmit={onSubmit} isLoading={isPending} />
      </Container>
    </Box>
  );
};

export default CodeItemCreate;
