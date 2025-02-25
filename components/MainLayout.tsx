import { ReactNode } from "react";
import {
  Box,
  Container,
  Grid2,
  Typography,
  TypographyProps,
} from "@mui/material";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  titleProps?: TypographyProps;
  toolbar?: ReactNode;
}

export const MainLayout = ({
  children,
  title,
  toolbar,
  titleProps,
}: MainLayoutProps) => {
  return (
    <Box component="main" pt={12} pb={8}>
      <Container maxWidth="lg">
        <Grid2 container gap={2} direction="column">
          {toolbar}

          <Typography
            variant="h2"
            mb={{ xs: 2, md: 4 }}
            title={title}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              wordBreak: "break-all",
            }}
            {...titleProps}
          >
            {title}
          </Typography>

          {children}
        </Grid2>
      </Container>
    </Box>
  );
};
