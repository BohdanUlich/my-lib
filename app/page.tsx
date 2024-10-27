"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import {
  CreateCategoryButton,
  CategoriesFilterModal,
  CategoriesList,
} from "@/components/categories";
import { SearchInput } from "@/components/inputs";

const Home = () => {
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
            <CreateCategoryButton />

            <Grid item ml="auto">
              <SearchInput />
            </Grid>

            <CategoriesFilterModal />
          </Grid>

          <CategoriesList />
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
