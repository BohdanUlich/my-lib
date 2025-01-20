"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { Grid2 } from "@mui/material";
import { CodeItemForm } from "@/components/code-items/CodeItemForm";
import { fetchOneCodeItem, useUpdateCodeItem } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { useProgress } from "@/providers/ProgressBarProvider";
import { Button, MainLayout } from "@/components";

interface EditCodeItemToolbarProps {
  codeItemId: string;
}

const EditCodeItemToolbar = ({ codeItemId }: EditCodeItemToolbarProps) => {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const categoryId = searchParams.get("categoryId");
  const { setLoadingProgress } = useProgress();

  const onRedirectToShow = () => {
    setLoadingProgress(true);
    push(`/code-items/show/${codeItemId}?categoryId=${categoryId}`);
  };

  const onRedirectToList = () => {
    setLoadingProgress(true);
    push(`/code-items?categoryId=${categoryId}`);
  };

  return (
    <Grid2 container gap={1} justifyContent="end">
      <Button onClick={onRedirectToList}>Back</Button>

      <Button onClick={onRedirectToShow}>Show</Button>
    </Grid2>
  );
};

export const EditCodeItem = () => {
  const params = useParams();
  const codeItemId = String(params.id);
  const { setLoadingProgress } = useProgress();
  const { updateCodeItem, isPending } = useUpdateCodeItem();

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
    <MainLayout
      title="Edit code item"
      titleProps={{ textAlign: "center" }}
      toolbar={<EditCodeItemToolbar codeItemId={codeItemId} />}
    >
      <CodeItemForm
        onSubmit={onSubmit}
        isLoading={isPending}
        codeItem={codeItem}
      />
    </MainLayout>
  );
};
