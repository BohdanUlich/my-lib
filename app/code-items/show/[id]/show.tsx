"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Container, Grid, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useQuery } from "@tanstack/react-query";
import { fetchOneCodeItem } from "@/api/codeItems/fetchOneCodeItem";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import {
  Button,
  CodeEditorView,
  DeleteCodeItemButton,
  RichTextEditorView,
} from "@/components";
import { useProgress } from "@/providers/ProgressBarProvider";
import { useSnackbar } from "notistack";

const typographyStyles = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  wordBreak: "break-word",
};

export const ShowCodeItem = () => {
  const params = useParams();
  const { setLoadingProgress } = useProgress();
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();
  const codeItemId = String(params.id);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const { data: codeItem } = useQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () => fetchOneCodeItem({ codeItemId }),
  });

  const description = codeItem?.description;
  const code = codeItem?.code;

  useEffect(() => {
    setLoadingProgress(false);
  }, [setLoadingProgress]);

  const goBackToList = () => {
    push(`/code-items?categoryId=${categoryId}`);
  };

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
        });
    }
  };

  return (
    <Box component="main">
      <Container maxWidth="lg" sx={{ pt: 5, pb: 2 }}>
        <Grid
          container
          sx={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            rowGap: 1.5,
          }}
        >
          <Grid container gap={1} justifyContent="end">
            <Button onClick={goBackToList}>Back</Button>

            <Button
              component={Link}
              href={`/code-items/edit/${codeItemId}?categoryId=${categoryId}`}
            >
              Edit
            </Button>
          </Grid>

          <Typography variant="h3" sx={typographyStyles}>
            {codeItem?.name}
          </Typography>

          {description && (
            <RichTextEditorView
              content={codeItem.description ?? ""}
              readonly={true}
            />
          )}

          {code && (
            <Grid container flexDirection="column" gap={0.5} alignItems="end">
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
            </Grid>
          )}

          <Grid container justifyContent="end">
            <DeleteCodeItemButton
              codeItemId={codeItemId}
              codeItemName={codeItem?.name ?? ""}
              backAfterDelete
              variant="contained"
              color="error"
            >
              Delete
            </DeleteCodeItemButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
