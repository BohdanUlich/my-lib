import type { Metadata } from "next";
import { Avatar, Typography, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export const metadata: Metadata = {
  title: "Registration",
  description: "My-lib registration page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container
      maxWidth="xs"
      sx={{
        height: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Avatar sx={{ bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>

      <Typography component="h1" variant="h5" mb={1}>
        Sign up
      </Typography>

      {children}
    </Container>
  );
}
