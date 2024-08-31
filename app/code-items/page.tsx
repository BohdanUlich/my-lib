"use client";

import Link from "next/link";
import { Box, Container, Grid, Typography, List } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams } from "next/navigation";
import {
  Button,
  CategoriesFilter,
  CodeItem,
  LoadingSpinner,
  SearchInput,
} from "@/components";
import { useGetCodeItems } from "@/api";

const CodeItemsPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { data: codeItems = [], isLoading } = useGetCodeItems();

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
              <CategoriesFilter />
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
                  key={codeItem.id}
                />
              ))}
            </List>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CodeItemsPage;
