import { Box } from "@mui/material";
import { Metadata } from "next";

interface CategoryProps {
  params: { slug: string };
}

export async function generateMetadata({
  params: { slug },
}: CategoryProps): Promise<Metadata> {
  return {
    title: slug,
  };
}

const Category = () => {
  return <Box>Category</Box>;
};

export default Category;
