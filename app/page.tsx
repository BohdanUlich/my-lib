"use client";
import { Button, CategoryCard } from "@/components";
import { Box, Container, Grid } from "@mui/material";
import { signOut } from "next-auth/react";
import AddIcon from "@mui/icons-material/Add";
import { useGetCategories } from "@/hooks";
import { useCallback, useEffect } from "react";
import { useCategories } from "@/providers";

const Home = () => {
  const { categories } = useGetCategories();
  const { currentCategories, setCurrentCategories } = useCategories();

  console.log({ categories, currentCategories });

  useEffect(() => {
    if ((!categories.length && currentCategories.length) || categories.length) {
      setCurrentCategories(categories);
    }
    //eslint-disable-next-line
  }, [categories, setCurrentCategories]);

  const onAddNewCategory = () => {
    setCurrentCategories((prev) => [
      { name: "", id: "", user_id: "", order: 1 },
      ...prev,
    ]);
  };

  const onFinishCreatingCategory = useCallback(() => {
    setCurrentCategories(categories);
  }, [categories, setCurrentCategories]);

  return (
    <Box component="main">
      <Container maxWidth="lg">
        <Grid
          container
          gap={2}
          flexDirection="column"
          justifyContent="center"
          minHeight="100vh"
        >
          {
            <Button onClick={() => signOut()} variant="contained">
              Log out
            </Button>
          }

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
          <Grid container gap={2} alignItems="stretch">
            {currentCategories?.map((category) => (
              <Grid item xs={6} md={4} lg={3} key={category.id}>
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
