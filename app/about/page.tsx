import { Metadata } from "next";
import { Container, Typography, List, ListItem, Box } from "@mui/material";
import { Button } from "@/components/buttons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About My Lib - Your Personal Code Library",
  description:
    "My Lib is a simple and efficient way to store, organize, and reuse code snippets, scripts, configurations, and more. Create your own personal library with frontend, backend, and any programming languages.",
  robots: "index, follow",
};

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h1" gutterBottom textAlign="center">
        About My Lib
      </Typography>

      <Typography paragraph fontSize={18}>
        My Lib is a powerful yet simple tool designed for developers who need a
        fast, organized, and efficient way to save and retrieve code snippets,
        scripts, configurations, and more.
      </Typography>

      <Box display="flex" gap={3} justifyContent="center" my={3}>
        <Button size="large" variant="contained" href="/login" component={Link}>
          Sign in
        </Button>
        <Button
          size="large"
          variant="contained"
          href="/registration"
          component={Link}
        >
          Sign up
        </Button>
      </Box>

      <Typography variant="h2" gutterBottom textAlign="center">
        Why Use My Lib?
      </Typography>

      <Typography paragraph fontSize={18}>
        Instead of searching through old projects or repositories, save your
        frequently used code in My Lib and retrieve it instantly whenever you
        need it. Perfect for work, personal projects, and improving efficiency.
      </Typography>

      <Typography variant="h3" gutterBottom textAlign="center">
        Key Features
      </Typography>

      <List sx={{ fontSize: 18 }}>
        <ListItem>
          Create custom categories like Components, Configs, Helpers, Styles.
        </ListItem>
        <ListItem>
          Assign labels (e.g., FE, BE, env, MUI) for easy filtering.
        </ListItem>
        <ListItem>Search categories by name for quick access.</ListItem>
        <ListItem>
          Add rich descriptions with a powerful editor supporting text
          formatting, code snippets, images, links, and more.
        </ListItem>
        <ListItem>
          Use Monaco Editor for syntax highlighting and better coding
          experience.
        </ListItem>
        <ListItem>
          Fast filter and search code items by tags and names.
        </ListItem>
      </List>
    </Container>
  );
}
