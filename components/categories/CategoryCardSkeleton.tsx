import { Skeleton } from "@mui/material";

export const CategoryCardSkeleton = () => {
  return (
    <Skeleton
      variant="rounded"
      animation="wave"
      sx={{ width: "100%", pb: 20 }}
    />
  );
};
