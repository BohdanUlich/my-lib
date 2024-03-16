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
import { Label } from "./Label";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useCreateCategory, useUpdateCategory } from "@/hooks";
import { Form, TextInput, Button, DeleteCategoryButton } from "./";
import { FieldValues } from "react-hook-form";
import * as z from "zod";

interface CategoryCardProps {
  categoryName: string;
  categoryId: string;
  isNewCategory: boolean;
  userId: string;
  onFinishCreatingCategory: () => void;
}

const schema = z.object({
  editedCategoryName: z.string().min(1, { message: "Required" }),
});

export const CategoryCard = ({
  categoryName,
  categoryId,
  isNewCategory,
  userId,
  onFinishCreatingCategory,
}: CategoryCardProps) => {
  const [isEdit, setIsEdit] = useState(false);
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
      } else {
        if (data.editedCategoryName !== categoryName) {
          await updateCategory({
            name: data.editedCategoryName,
            user_id: userId,
            id: categoryId,
          });
        }
      }
    } finally {
      setIsEdit(false);
    }
  };

  const onClickOutside = () => {
    setIsEdit(false);
    onFinishCreatingCategory();
  };

  return (
    <Form schema={schema} onSubmit={onSave} sx={{ height: 1 }}>
      <Box
        sx={{
          position: "relative",
          zIndex: isEdit || isNewCategory ? 20 : 9,
          height: 1,
        }}
      >
        <Card
          sx={{
            height: 1,
            "&:hover": { ".MuiSvgIcon-root": { color: "text.primary" } },
          }}
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
                  <Grid container item gap={0.5} xs={11} overflow="hidden">
                    <Grid item display="flex" maxWidth="32%">
                      <Label
                        labelName="Test label dsjgkjgsdhgjksh jangdjlbgsadbgk jasdbgjkgbskjd"
                        labelColor="secondary"
                        colorToken="main"
                      />
                    </Grid>
                  </Grid>

                  {!isEdit && (
                    <Grid
                      item
                      display="flex"
                      justifyContent="end"
                      xs={1}
                      onClick={() => setIsEdit(true)}
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
          <>
            {!isNewCategory && (
              <Box
                display="flex"
                flexDirection="column"
                gap={0.5}
                sx={{ position: "absolute", top: 0, right: -150, zIndex: 10 }}
              >
                <Button variant="contained">Edit Labels</Button>

                <DeleteCategoryButton
                  categoryId={categoryId}
                  categoryName={categoryName}
                />
              </Box>
            )}

            <Button
              variant="contained"
              type="submit"
              sx={{ position: "absolute", bottom: -40, left: 0, zIndex: 10 }}
              isLoading={isLoading}
            >
              Save
            </Button>
          </>
        )}
      </Box>

      {(isEdit || isNewCategory) && (
        <Backdrop open={true} onClick={onClickOutside} sx={{ zIndex: 10 }} />
      )}
    </Form>
  );
};
