"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchOneCodeItem } from "@/api/codeItems/fetchOneCodeItem";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { Button, CodeEditorView, DeleteCodeItemButton } from "@/components";
import { useProgress } from "@/providers/ProgressBarProvider";

const typographyStyles = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  wordBreak: "break-word",
};

export const ShowCodeItem = () => {
  const params = useParams();
  const { setLoadingProgress } = useProgress();
  const { back } = useRouter();
  const codeItemId = `${params.id}` ?? "";

  const { data: codeItem } = useQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () => fetchOneCodeItem({ codeItemId }),
  });

  useEffect(() => {
    setLoadingProgress(false);
  }, [setLoadingProgress]);

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
          <Typography variant="h3" sx={typographyStyles}>
            {codeItem?.name}
          </Typography>

          <Typography fontSize={20} sx={typographyStyles}>
            {codeItem?.description}
          </Typography>

          <CodeEditorView
            language={codeItem?.language ?? ""}
            value={codeItem?.code}
            readOnly
          />

          <Grid container justifyContent="space-between">
            <Button
              variant="contained"
              onClick={back}
              sx={{ alignSelf: "flex-start" }}
            >
              Back
            </Button>

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
