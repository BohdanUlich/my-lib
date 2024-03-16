"use client";
import { Button, CategoryCard } from "@/components";
import { Box, Container, Grid } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import AddIcon from "@mui/icons-material/Add";
import { useGetCategories } from "@/hooks";
import { useEffect, useState } from "react";
import { Category } from "@/types";

const Home = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { categories } = useGetCategories({ userId });
  const [currentCategories, setCurrentCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categories.length) setCurrentCategories(categories);
  }, [categories]);

  const onAddNewCategory = () => {
    setCurrentCategories((prev) => [
      { name: "", id: "", user_id: "", order: 1 },
      ...prev,
    ]);
  };

  const onFinishCreatingCategory = () => {
    setCurrentCategories(categories);
  };

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
                  userId={userId}
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
