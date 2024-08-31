"use client";

import AddIcon from "@mui/icons-material/Add";
import { useCategories } from "@/providers";
import { Button } from "../buttons";

export const CreateCategoryButton = () => {
  const { setCurrentCategories } = useCategories();

  const onAddNewCategory = () => {
    setCurrentCategories((prev) => [
      { name: "", id: "", user_id: "", order: 1 },
      ...prev,
    ]);
  };

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      sx={{ maxWidth: 1 }}
      onClick={onAddNewCategory}
    >
      Create category
    </Button>
  );
};
