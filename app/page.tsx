"use client";
import { Box, Button, Container, Grid } from "@mui/material";
import { signOut } from "next-auth/react";

const Home = () => {
  return (
    <Box component="main">
      <Container maxWidth="xl" sx={{ height: 1 }}>
        <Grid container>
          <Button onClick={() => signOut()} variant="contained">
            Log out
          </Button>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
