"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  CategoryCard,
  CategoriesFilter,
  SearchInput,
  CategoryCardSkeleton,
} from "@/components";
import { Box, Container, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCategories } from "@/providers";
import { useSearchParams } from "next/navigation";
import { getCategoryIdsFromLabels } from "@/helpers";
import { CATEGORY_TYPE } from "@/types";
import { useGetCategories, useGetLabels } from "@/api";

const Home = () => {
  const {
    data: categories = [],
    isLoading,
    fetchStatus,
    isSuccess,
  } = useGetCategories();
  const { data: labels } = useGetLabels({ labelType: CATEGORY_TYPE });
  const { currentCategories, setCurrentCategories } = useCategories();
  const searchParams = useSearchParams();
  const labelIds = searchParams.getAll("label");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const isCategoriesIdle = fetchStatus === "idle" && !isSuccess;

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

  const onAddNewCategory = () => {
    setCurrentCategories((prev) => [
      { name: "", id: "", user_id: "", order: 1 },
      ...prev,
    ]);
  };

  const onFinishCreatingCategory = useCallback(() => {
    labelIds.length
      ? setCurrentCategories(filteredCategories)
      : setCurrentCategories(categories);
  }, [categories, labelIds, filteredCategories, setCurrentCategories]);

  return (
    <Box component="main">
      <Container maxWidth="lg">
        <Grid container gap={2.5} flexDirection="column" pt={5} pb={3}>
          <Typography variant="h2" mb={4}>
            Categories
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
                onClick={onAddNewCategory}
              >
                Create category
              </Button>
            </Grid>

            <Grid item ml="auto">
              <SearchInput />
            </Grid>

            <Grid item>
              <CategoriesFilter />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="stretch">
            {isLoading || isCategoriesIdle
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
