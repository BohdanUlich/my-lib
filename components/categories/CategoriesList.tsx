"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Grid } from "@mui/material";
import { useCategories } from "@/providers";
import { getCategoryIdsFromLabels } from "@/helpers";
import { CATEGORY_TYPE } from "@/types";
import { useGetCategories, useGetLabels } from "@/api";
import { CategoryCard } from "./CategoryCard";
import { CategoryCardSkeleton } from "./CategoryCardSkeleton";
import { LoadingSpinner } from "../LoadingSpinner";
import { useInView } from "react-intersection-observer";

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
  const { data: labels } = useGetLabels({ labelType: CATEGORY_TYPE });
  const { currentCategories, setCurrentCategories } = useCategories();
  const searchParams = useSearchParams();
  const labelIds = searchParams.getAll("label");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    // Initial categories filtering when label ids are in search params
    if (labels?.length && categories.length && labelIds.length) {
      const categoryIds = getCategoryIdsFromLabels({ labelIds, labels });

      const filteredCategories = categories.filter((category) =>
        categoryIds.includes(category.id)
      );

      setFilteredCategories(filteredCategories);
      setCurrentCategories(filteredCategories);

      return;
    }

    // Initial set of categories without filters
    if ((!categories.length && currentCategories.length) || categories.length) {
      setCurrentCategories(categories);
    }

    //eslint-disable-next-line
  }, [labels, categories, setCurrentCategories, searchParams]);

  const onFinishCreatingCategory = useCallback(() => {
    labelIds.length
      ? setCurrentCategories(filteredCategories)
      : setCurrentCategories(categories);
  }, [categories, labelIds, filteredCategories, setCurrentCategories]);

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <Grid container spacing={2} alignItems="stretch">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <CategoryCardSkeleton />
            </Grid>
          ))
        : currentCategories?.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <CategoryCard
                categoryName={category.name}
                isNewCategory={!category.id}
                onFinishCreatingCategory={onFinishCreatingCategory}
                categoryId={category.id}
                labels={category.labels || []}
              />
            </Grid>
          ))}
      {hasNextPage && !isLoading && (
        <Box ref={ref} width={1} py={2} display="flex" justifyContent="center">
          <LoadingSpinner />
        </Box>
      )}
    </Grid>
  );
};
