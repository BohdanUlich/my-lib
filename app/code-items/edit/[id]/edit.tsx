"use client";

import { CodeItemForm } from "@/components";
import { useParams } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { Box, Container, Typography } from "@mui/material";
import { fetchOneCodeItem, useUpdateCodeItem } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { useGetUser } from "@/hooks";

export const EditCodeItem = () => {
  const { updateCodeItem, isPending } = useUpdateCodeItem();
  const { userId } = useGetUser();
  const params = useParams();
  const codeItemId = `${params.id}` ?? "";

  const { data: codeItem } = useSuspenseQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () => fetchOneCodeItem({ userId, codeItemId }),
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
