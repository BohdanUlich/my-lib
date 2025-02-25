"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useGetCodeItems, useGetLabels } from "@/api";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams } from "next/navigation";
import {
  Box,
  List,
  Grid2,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import {
  LoadingSpinner,
  SearchInput,
  CodeItem,
  Button,
  MainLayout,
  FiltersModal,
} from "@/components";
import { CODE_ITEM_TYPE } from "@/types";
import { useProgress } from "@/providers/ProgressBarProvider";
import { useInView } from "react-intersection-observer";

interface CodeItemsListProps {
  pageTitle: string;
}

export const CodeItemsList = ({ pageTitle }: CodeItemsListProps) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { setLoadingProgress } = useProgress();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <MainLayout title={pageTitle}>
      <Grid2
        container
        justifyContent="space-between"
        direction={{ xs: "column-reverse", sm: "row" }}
        alignItems="center"
        gap={2}
        flexWrap="nowrap"
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ maxWidth: 1 }}
          component={Link}
          href={`code-items/create?categoryId=${categoryId}`}
          fullWidth={isMobile}
        >
          Create code item
        </Button>

        <Grid2
          container
          alignItems="center"
          gap={2}
          ml={{ xs: 0, sm: "auto" }}
          flexWrap="nowrap"
          width={{ xs: "100%", sm: "auto" }}
        >
          <SearchInput />

          <FiltersModal labelType={CODE_ITEM_TYPE} />
        </Grid2>
      </Grid2>

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
      ) : codeItems.length ? (
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
      ) : (
        <Typography mt={3}>No code items found...</Typography>
      )}
    </MainLayout>
  );
};
