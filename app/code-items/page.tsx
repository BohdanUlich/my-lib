"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useGetCodeItems, useGetLabels } from "@/api";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams } from "next/navigation";
import { Box, Container, Grid, Typography, List } from "@mui/material";
import {
  CodeItemsFilterModal,
  LoadingSpinner,
  SearchInput,
  CodeItem,
  Button,
} from "@/components";
import { CODE_ITEM_TYPE } from "@/types";
import { useProgress } from "@/providers/ProgressBarProvider";
import { useInView } from "react-intersection-observer";

const CodeItemsPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { setLoadingProgress } = useProgress();
  const {
    data: codeItemsResponse,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetCodeItems({ limit: 20 });
  useGetLabels({ labelType: CODE_ITEM_TYPE });

  const codeItems = useMemo(
    () => codeItemsResponse?.pages.flatMap((page) => page.data) || [],
    [codeItemsResponse]
  );

  useEffect(() => {
    setLoadingProgress(false);
  }, [setLoadingProgress]);

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <Box component="main">
      <Container maxWidth="lg">
        <Grid container gap={2.5} flexDirection="column" pt={5} pb={3}>
          <Typography variant="h2" mb={4}>
            Code items
          </Typography>

          <Grid
            container
            item
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ maxWidth: 1 }}
                component={Link}
                href={`code-items/create?categoryId=${categoryId}`}
              >
                Create item
              </Button>
            </Grid>

            <Grid item ml="auto">
              <SearchInput />
            </Grid>

            <Grid item>
              <CodeItemsFilterModal />
            </Grid>
          </Grid>

          {isLoading ? (
            <Box padding={9} position="relative">
              <LoadingSpinner
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              />
            </Box>
          ) : (
            <List
              dense
              sx={{ width: "100%", "& .MuiTypography-root": { fontSize: 20 } }}
            >
              {codeItems?.map((codeItem) => (
                <CodeItem
                  codeItemName={codeItem.name}
                  codeItemId={codeItem.id}
                  codeItemLabels={codeItem?.labels || []}
                  key={codeItem.id}
                />
              ))}
              {hasNextPage && !isLoading && (
                <Box
                  ref={ref}
                  width={1}
                  py={2}
                  display="flex"
                  justifyContent="center"
                >
                  <LoadingSpinner />
                </Box>
              )}
            </List>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CodeItemsPage;
