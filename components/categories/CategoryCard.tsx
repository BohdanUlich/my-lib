"use client";

import { useState, useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Edit } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { CATEGORY_TYPE, Label as ILabel } from "@/types";
import { useCreateCategory, useUpdateCategory } from "@/api";
import { Form } from "../Form";
import { TextInput } from "../inputs";
import { Button } from "../buttons";
import { Label, EditLabelButton } from "../labels";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { useProgress } from "@/providers/ProgressBarProvider";

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
  const router = useRouter();
  const { createCategory, isPending: isLoadingCreate } = useCreateCategory();
  const { updateCategory, isPending: isLoadingUpdate } = useUpdateCategory();
  const { setLoadingProgress } = useProgress();
  const isLoading = isLoadingCreate || isLoadingUpdate;
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const onSave = async (data: FieldValues) => {
    try {
      if (data.editedCategoryName === categoryName) {
        setIsEdit(false);
        return;
      }

      if (isNewCategory) {
        await createCategory({
          name: data.editedCategoryName,
        });

        return;
      }

      await updateCategory({
        name: data.editedCategoryName,
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
    if (!isEdit && !isNewCategory) {
      setLoadingProgress(true);
      router.push(`/code-items?categoryId=${categoryId}`);
    }
  };

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      const lineHeight = parseInt(
        window.getComputedStyle(element).lineHeight,
        10
      );
      const textHeight = element.scrollHeight;
      const numberOfLines = textHeight / lineHeight;
      if (numberOfLines > 2.3) {
        setShowTooltip(true);
      }
    }
  }, [categoryName]);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          zIndex: isEdit || isNewCategory ? 20 : 8,
          height: 1,
        }}
      >
        <Form schema={schema} onSubmit={onSave} sx={{ height: 1 }}>
          <Card onClick={onRedirect}>
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
                              color: "#000",
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                )}

                {isEdit || isNewCategory ? (
                  <TextInput
                    spellCheck="false"
                    variant="standard"
                    defaultValue={categoryName}
                    name="editedCategoryName"
                    inputProps={{
                      sx: {
                        fontSize: 30,
                        textAlign: "center",
                        padding: 0,
                        paddingBottom: "1px",
                        boxSizing: "border-box",
                        height: 75,
                      },
                    }}
                    sx={{
                      ".MuiInputBase-root::before": {
                        border: 0,
                      },
                      ".MuiInputBase-root::after": {
                        border: 0,
                      },
                    }}
                    autoFocus
                  />
                ) : (
                  <Tooltip
                    placement="bottom"
                    arrow
                    title={showTooltip ? categoryName : ""}
                    componentsProps={{
                      tooltip: {
                        sx: { fontSize: 10 },
                      },
                    }}
                  >
                    <Typography
                      ref={textRef}
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: { xs: 5, sm: 2 },
                        overflow: "hidden",
                        wordBreak: "break-word",
                        textAlign: "center",
                        lineHeight: 1.3,
                        fontSize: { xs: 26, md: 30 },
                      }}
                    >
                      {categoryName}
                    </Typography>
                  </Tooltip>
                )}
              </CardContent>
            </CardActionArea>
          </Card>

          {(isEdit || isNewCategory) && (
            <Button
              variant="contained"
              type="submit"
              sx={{ position: "absolute", bottom: -43, left: 0, zIndex: 11 }}
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
                sx={{ position: "absolute", top: 0, right: -142, zIndex: 11 }}
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
