"use client";

import { CodeEditorView } from "@/components/code-editor/CodeEditorView";
import { fetchOneCodeItem } from "@/api/codeItems/fetchOneCodeItem";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { Button } from "@/components";
import { useGetUser } from "@/hooks";

const CodeItemShowPage = () => {
  const params = useParams();
  const { back } = useRouter();
  const codeItemId = `${params.id}` ?? "";
  const { userId } = useGetUser();

  const typographyStyles = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word",
  };

  const { data: codeItem } = useSuspenseQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () => fetchOneCodeItem({ userId, codeItemId }),
  });

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

          <Button
            variant="contained"
            onClick={back}
            sx={{ alignSelf: "flex-start" }}
          >
            Back
          </Button>

          <CodeEditorView
            language={codeItem?.language}
            value={codeItem?.code}
            readOnly
          />
        </Grid>
      </Container>
    </Box>
  );
};
export default CodeItemShowPage;
