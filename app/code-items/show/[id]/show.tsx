"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Grid2 } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useQuery } from "@tanstack/react-query";
import { fetchOneCodeItem } from "@/api/codeItems/fetchOneCodeItem";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import {
  Button,
  CodeEditorView,
  DeleteCodeItemButton,
  MainLayout,
  RichTextEditorView,
} from "@/components";
import { useProgress } from "@/providers/ProgressBarProvider";
import { useSnackbar } from "notistack";

interface ShowCodeItemToolbarProps {
  codeItemId: string;
}

const ShowCodeItemToolbar = ({ codeItemId }: ShowCodeItemToolbarProps) => {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const categoryId = searchParams.get("categoryId");
  const { setLoadingProgress } = useProgress();

  const onRedirectToEdit = () => {
    setLoadingProgress(true);
    push(`/code-items/edit/${codeItemId}?categoryId=${categoryId}`);
  };

  const onRedirectToList = () => {
    setLoadingProgress(true);
    push(`/code-items?categoryId=${categoryId}`);
  };

  return (
    <Grid2 container gap={1} justifyContent="end">
      <Button onClick={onRedirectToList}>Back</Button>

      <Button onClick={onRedirectToEdit}>Edit</Button>
    </Grid2>
  );
};

export const ShowCodeItem = () => {
  const params = useParams();
  const { setLoadingProgress } = useProgress();
  const { enqueueSnackbar } = useSnackbar();
  const codeItemId = String(params.id);

  const { data: codeItem } = useQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () => fetchOneCodeItem({ codeItemId }),
  });

  const description = codeItem?.description;
  const code = codeItem?.code;

  useEffect(() => {
    setLoadingProgress(false);
  }, [setLoadingProgress]);

  const onCopyCode = () => {
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          enqueueSnackbar("Code copied", {
            variant: "success",
          });
        })
        .catch((error) => {
          enqueueSnackbar("Copy failed", {
            variant: "error",
          });
          console.error(error);
        });
    }
  };

  return (
    <MainLayout
      title={codeItem?.name ?? "Code item"}
      titleProps={{ textAlign: "center", mb: 0 }}
      toolbar={<ShowCodeItemToolbar codeItemId={codeItemId} />}
    >
      {description && (
        <RichTextEditorView
          content={codeItem.description ?? ""}
          readonly={true}
        />
      )}

      {code && (
        <Grid2 container direction="column" gap={0.5} alignItems="end">
          <Button
            sx={{ display: "flex", gap: 0.5 }}
            onClick={onCopyCode}
            disabled={!code}
          >
            Copy
            <ContentCopyIcon />
          </Button>

          <CodeEditorView
            language={codeItem?.language ?? ""}
            value={code}
            readOnly
          />
        </Grid2>
      )}

      <Grid2 container justifyContent="end">
        <DeleteCodeItemButton
          codeItemId={codeItemId}
          codeItemName={codeItem?.name ?? ""}
          backAfterDelete
          variant="contained"
          color="error"
        >
          Delete
        </DeleteCodeItemButton>
      </Grid2>
    </MainLayout>
  );
};
