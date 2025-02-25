import { Metadata } from "next";
import { Container, Typography, List, ListItem, Box } from "@mui/material";
import { Button } from "@/components/buttons";
import Link from "next/link";
import Image from "next/legacy/image";

export const metadata: Metadata = {
  title: "About My Lib - Your Personal Code Library",
  description:
    "My Lib is a simple and efficient way to store, organize, and reuse code snippets, scripts, configurations, and more. Create your own personal library with frontend, backend, and any programming languages.",
  robots: "index, follow",
};

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography component="h1" variant="h2" my={3} textAlign="center">
        My Lib: Your Universal Code & Knowledge Organizer for IT Professionals
      </Typography>

      <Typography fontSize={18}>
        My Lib is an intuitive platform built for developers, DevOps engineers,
        IT specialists, and anyone working with code or technical information.
        More than just a snippet manager, it’s a versatile workspace to organize
        your knowledge
      </Typography>

      <Box display="flex" gap={3} justifyContent="center" my={5}>
        <Button size="large" variant="contained" href="/" component={Link}>
          Homepage
        </Button>
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

      <Typography variant="h2" my={3} textAlign="center">
        What Makes My Lib Indispensable?
      </Typography>

      <Typography fontSize={18} mb={2}>
        🚀 Build Your Personal Code Library Save code snippets in any language
        (JavaScript, Python, Go, SQL, etc.) for frontend, backend, mobile
        development, or automation tasks. The built-in code editor with syntax
        highlighting ensures a seamless coding experience.
      </Typography>

      <Typography fontSize={18} mb={2}>
        📂 Organize Beyond Code Store server configurations, instructions,
        documentation, checklists, bookmarks, and even images. The rich text
        editor lets you format content, add tables, lists, and embed media.
      </Typography>

      <Typography fontSize={18} mb={2}>
        🏷️ Instant Access with Categories & Labels Sort data into customizable
        categories and apply labels for precise filtering. Examples: “Docker
        Configs,” “React Hooks,” “SQL Templates.”
      </Typography>

      <Typography fontSize={18}>
        🔍 Find Anything in Seconds Search by category names, labels, or content
        within code items—no more digging through messy folders, old projects,
        or dozens of repositories. Stop wasting time scrolling through forums or
        GitHub to rediscover solutions you’ve already used. With My Lib, every
        piece of code, configuration, or knowledge you’ve saved is just a quick
        search away.
      </Typography>

      <Box display={{ xs: "none", md: "block" }}>
        <Typography component="h3" variant="h2" my={5} textAlign="center">
          Example of usage:
        </Typography>

        <Typography variant="h4" mb={2}>
          Home page with categories:
        </Typography>

        <Box
          height={560}
          width={1}
          position="relative"
          border={1}
          borderRadius={2}
          overflow="hidden"
        >
          <Image
            src="/about/categories.png"
            alt="Categories example"
            objectFit="contain"
            layout="fill"
            quality={100}
          />
        </Box>

        <Typography variant="h4" my={2}>
          Code items inside category:
        </Typography>

        <Box
          height={550}
          width={1}
          position="relative"
          border={1}
          borderRadius={2}
          mt={2}
          overflow="hidden"
        >
          <Image
            src="/about/code-items-styles.png"
            alt="Code items example"
            objectFit="contain"
            layout="fill"
            quality={100}
          />
        </Box>
      </Box>

      <Typography component="h4" variant="h2" my={3} textAlign="center">
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
