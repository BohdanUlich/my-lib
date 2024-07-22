"use client";

import { CodeItemForm } from "@/components";
import { useParams } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { Box, Container, Typography } from "@mui/material";
import { useUpdateCodeItem, useGetOneCodeItem } from "@/hooks/codeItems";

const CodeItemEdit = () => {
  const { updateCodeItem, isLoading } = useUpdateCodeItem();
  const { data: codeItem } = useGetOneCodeItem();
  const params = useParams();
  const id = params.id;

  const onSubmit = async (data: FieldValues) => {
    await updateCodeItem({
      name: data.name,
      description: data.description,
      code: data.code,
      language: data.language,
      id: `${id}`,
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
        <Typography variant="h3">Update code-item</Typography>
        <CodeItemForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          codeItem={codeItem}
        />
      </Container>
    </Box>
  );
};

export default CodeItemEdit;
