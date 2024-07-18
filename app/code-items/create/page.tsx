"use client";

import { useGetUser } from "@/hooks";
import { CodeItemForm } from "@/components";
import { FieldValues } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import { useCreateCodeItem } from "@/hooks/codeItems/useCreateCodeItem";

const CodeItemCreate = () => {
  const { userId } = useGetUser();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? "";
  const { createCodeItem, isLoading } = useCreateCodeItem();

  const onSubmit = async (data: FieldValues) => {
    await createCodeItem({
      name: data.name,
      user_id: userId,
      category_id: categoryId,
      description: data.description,
      code: data.code,
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
        <Typography fontSize="35px">Create code-item</Typography>
        <CodeItemForm onSubmit={onSubmit} isLoading={isLoading} />
      </Container>
    </Box>
  );
};

export default CodeItemCreate;
