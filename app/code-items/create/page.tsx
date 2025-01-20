"use client";

import { useCreateCodeItem } from "@/api";
import { FieldValues } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Grid2 } from "@mui/material";
import { Button } from "@/components/buttons";
import { CodeItemForm } from "@/components/code-items/CodeItemForm";
import { MainLayout } from "@/components";

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
    <MainLayout
      title="Create new code item"
      titleProps={{ textAlign: "center" }}
      toolbar={
        <Grid2 container justifyContent="end">
          <Button onClick={back}>Back</Button>
        </Grid2>
      }
    >
      <CodeItemForm onSubmit={onSubmit} isLoading={isPending} />
    </MainLayout>
  );
};

export default CodeItemCreate;
