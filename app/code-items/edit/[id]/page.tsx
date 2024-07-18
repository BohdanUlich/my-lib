"use client";

import { CodeItemForm } from "@/components";
import { useParams } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { useUpdateCodeItem } from "@/hooks/codeItems";
import { Box, Container, Typography } from "@mui/material";

const CodeItemEdit = () => {
  const { updateCodeItem, isLoading } = useUpdateCodeItem();
  const params = useParams();
  const id = params.id;

  const onSubmit = async (data: FieldValues) => {
    await updateCodeItem({
      name: data.name,
      description: data.description,
      code: data.code,
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
        <Typography fontSize="35px">Update code-item</Typography>
        <CodeItemForm onSubmit={onSubmit} isLoading={isLoading} />
      </Container>
    </Box>
  );
};

export default CodeItemEdit;
