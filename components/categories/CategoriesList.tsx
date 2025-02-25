"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useCategories } from "@/providers";
import { useGetCategories } from "@/api";
import { CategoryCard } from "./CategoryCard";
import { CategoryCardSkeleton } from "./CategoryCardSkeleton";
import { LoadingSpinner } from "../LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { isCategoryLabelsEdited } from "@/helpers";

export const CategoriesList = () => {
  const {
    data: categoriesResponse,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetCategories();

  const categories = useMemo(
    () => categoriesResponse?.pages.flatMap((page) => page.data) || [],
    [categoriesResponse]
  );
  const { currentCategories, setCurrentCategories } = useCategories();

  useEffect(() => {
    // Initial set of categories
    if (categories.length) {
      setCurrentCategories(categories);
    }
  }, [categories]);

  const onFinishCreatingCategory = useCallback(() => {
    setCurrentCategories(categories);
  }, [categories, setCurrentCategories]);

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <Grid container spacing={2} alignItems="stretch">
      {isLoading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <CategoryCardSkeleton />
          </Grid>
        ))
      ) : currentCategories.length ? (
        currentCategories?.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <CategoryCard
              categoryName={category.name}
              isNewCategory={!category.id}
              onFinishCreatingCategory={onFinishCreatingCategory}
              categoryId={category.id}
              labels={category.labels || []}
              isCategoryLabelsEdited={isCategoryLabelsEdited({
                categories,
                categoryId: category.id,
                newLabels: category.labels || [],
              })}
            />
          </Grid>
        ))
      ) : (
        <Grid item>
          <Typography mt={3}>No categories found...</Typography>
        </Grid>
      )}
      {hasNextPage && !isLoading && (
        <Box ref={ref} width={1} py={2} display="flex" justifyContent="center">
          <LoadingSpinner />
        </Box>
      )}
    </Grid>
  );
};
