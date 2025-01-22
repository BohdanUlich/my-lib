"use client";

import { Grid2, useMediaQuery, useTheme } from "@mui/material";
import { CreateCategoryButton, CategoriesList } from "@/components/categories";
import { SearchInput } from "@/components/inputs";
import { MainLayout } from "@/components/MainLayout";
import { FiltersModal } from "@/components/modals";
import { CATEGORY_TYPE } from "@/types";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <MainLayout title="Categories">
      <Grid2
        container
        justifyContent="space-between"
        direction={{ xs: "column-reverse", sm: "row" }}
        alignItems="center"
        gap={2}
        flexWrap="nowrap"
      >
        <CreateCategoryButton fullWidth={isMobile} />

        <Grid2
          container
          alignItems="center"
          gap={2}
          ml={{ xs: 0, sm: "auto" }}
          flexWrap="nowrap"
          width={{ xs: "100%", sm: "auto" }}
        >
          <SearchInput />

          <FiltersModal labelType={CATEGORY_TYPE} />
        </Grid2>
      </Grid2>

      <CategoriesList />
    </MainLayout>
  );
};

export default Home;
