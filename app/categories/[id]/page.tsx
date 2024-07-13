"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button, CategoriesFilter, CodeItem } from "@/components";
import { SearchInput } from "@/components/SearchInput";
import { Box, Container, Grid, Typography, List } from "@mui/material";
import { useGetCodeItems } from "@/hooks/codeItems/useGetCodeItem";

const CategoryPage = () => {
  const { data: codeItems = [] } = useGetCodeItems();

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
              >
                Create item
              </Button>
            </Grid>

            <Grid item ml="auto">
              <SearchInput />
            </Grid>

            <Grid item>
              <CategoriesFilter />
            </Grid>
          </Grid>

          <List
            dense
            sx={{ width: "100%", "& .MuiTypography-root": { fontSize: 20 } }}
          >
            {codeItems?.map((codeItem) => (
              <CodeItem codeItemName={codeItem.name} key={codeItem.id} />
            ))}
          </List>
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoryPage;
