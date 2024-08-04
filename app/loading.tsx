"use client";

import { LoadingSpinner } from "@/components";
import { Container } from "@mui/material";

const Loading = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingSpinner size={50} />
    </Container>
  );
};

export default Loading;
