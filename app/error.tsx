"use client";

import { Button } from "@/components/buttons";
import { Container, Typography } from "@mui/material";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        pt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        height: "100vh",
      }}
    >
      <Typography variant="h2">Something went wrong!</Typography>
      <Button variant="contained" onClick={() => reset()}>
        Try again
      </Button>
    </Container>
  );
}
