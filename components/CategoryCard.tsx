"use client";
import { Edit } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useCreateCategory, useGetUser, useUpdateCategory } from "@/hooks";
import { Form } from "./Form";
import { FieldValues } from "react-hook-form";
import * as z from "zod";
import { EditLabelButton, Button, DeleteCategoryButton } from "./buttons";
import { TextInput } from "./inputs";
import { CATEGORY_TYPE, Label as ILabel } from "@/types";
import { Label } from "./Label";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  categoryName: string;
  categoryId: string;
  isNewCategory: boolean;
  labels: ILabel[];
  onFinishCreatingCategory: () => void;
}

const schema = z.object({
  editedCategoryName: z.string().min(1, { message: "Required" }),
});

export const CategoryCard = ({
  categoryName,
  categoryId,
  isNewCategory,
  labels,
  onFinishCreatingCategory,
}: CategoryCardProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const { userId } = useGetUser();
  const router = useRouter();
  const { createCategory, isLoading: isLoadingCreate } = useCreateCategory();
  const { updateCategory, isLoading: isLoadingUpdate } = useUpdateCategory();
  const isLoading = isLoadingCreate || isLoadingUpdate;

  const onSave = async (data: FieldValues) => {
    try {
      if (isNewCategory) {
        await createCategory({
          name: data.editedCategoryName,
          user_id: userId,
        });

        return;
      }

      await updateCategory({
        name: data.editedCategoryName,
        user_id: userId,
        id: categoryId,
        labels,
      });
    } finally {
      setIsEdit(false);
    }
  };

  const onClickOutside = () => {
    setIsEdit(false);
    onFinishCreatingCategory();
  };

  const onRedirect = () => {
    router.push(`/categories/${categoryId}`);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          zIndex: isEdit || isNewCategory ? 20 : 9,
          height: 1,
        }}
      >
        <Form schema={schema} onSubmit={onSave} sx={{ height: 1 }}>
          <Card
            sx={{
              height: 1,
              "&:hover": { ".MuiSvgIcon-root": { color: "text.primary" } },
            }}
            onClick={onRedirect}
          >
            <CardActionArea sx={{ height: 1 }}>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  p: 2,
                  pb: 4.5,
                  gap: 1,
                  fontSize: 40,
                  height: 1,
                  "&:hover": {
                    ".MuiSvgIcon-root": {
                      opacity: 1,
                    },
                  },
                }}
              >
                {!isNewCategory && (
                  <Grid container gap={1} flexWrap="nowrap">
                    <Grid
                      container
                      item
                      gap={0.5}
                      xs={11}
                      overflow="hidden"
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                      }}
                    >
                      {labels.map((label) => (
                        <Label
                          key={label.id}
                          labelName={label.name}
                          labelColor={label.color}
                        />
                      ))}
                    </Grid>

                    {!isEdit && (
                      <Grid
                        item
                        display="flex"
                        justifyContent="end"
                        xs={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEdit(true);
                        }}
                      >
                        <Edit
                          sx={{
                            opacity: 0,
                            transition: "0.1s all linear",
                            padding: 0.4,
                            height: 23,
                            width: 23,
                            borderRadius: "50%",
                            "&:hover": {
                              backgroundColor: grey[200],
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                )}

                {isEdit || isNewCategory ? (
                  <TextInput
                    variant="standard"
                    defaultValue={categoryName}
                    name="editedCategoryName"
                    inputProps={{
                      sx: {
                        fontSize: 50,
                        textAlign: "center",
                        padding: 0,
                        paddingBottom: "1px",
                        boxSizing: "border-box",
                        height: 75,
                      },
                    }}
                    autoFocus
                  />
                ) : (
                  <Typography fontSize={50}>{categoryName}</Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>

          {(isEdit || isNewCategory) && (
            <Button
              variant="contained"
              type="submit"
              sx={{ position: "absolute", bottom: -40, left: 0, zIndex: 11 }}
              isLoading={isLoading}
            >
              Save
            </Button>
          )}
        </Form>

        {(isEdit || isNewCategory) && (
          <>
            {!isNewCategory && (
              <Box
                display="flex"
                flexDirection="column"
                gap={0.5}
                sx={{ position: "absolute", top: 0, right: -150, zIndex: 11 }}
              >
                <Box sx={{ position: "relative" }}>
                  <EditLabelButton
                    categoryId={categoryId}
                    labelType={CATEGORY_TYPE}
                  />
                </Box>

                <DeleteCategoryButton
                  categoryId={categoryId}
                  categoryName={categoryName}
                  setIsEdit={() => setIsEdit(false)}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      <Backdrop
        open={isEdit || isNewCategory}
        onClick={onClickOutside}
        sx={{ zIndex: 10 }}
      />
    </>
  );
};
