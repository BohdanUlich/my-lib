"use client";

import * as z from "zod";
import CodeEditor from "@/components/CodeEditor";
import { Button, Form, TextInput } from "@/components";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useCreateCodeItem } from "@/hooks/codeItems/useCreateCodeItem";
import { useGetUser } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";

const CodeItemCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? "";
  const { userId } = useGetUser();
  const [code, setCode] = useState<string>("// Write your code");
  const { createCodeItem, isLoading } = useCreateCodeItem();

  const schema = z.object({
    name: z.string().min(1, { message: "Required" }),
    description: z.string(),
  });

  const onSave = async (data: FieldValues) => {
    await createCodeItem({
      name: data.name,
      user_id: userId,
      category_id: categoryId,
      description: data.description,
      code: code,
    });
    router.push(`/code-items?categoryId=${categoryId}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };
  return (
    <Box component="main">
      ``
      <Container
        maxWidth="md"
        sx={{
          pt: 5,
          pb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          rowGap: 1.5,
        }}
      >
        <Typography fontSize="35px">Create code-item</Typography>
        <Form schema={schema} onSubmit={onSave} sx={{ width: 1 }}>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              rowGap: 1.5,
            }}
          >
            <TextInput label="Name" spellCheck="false" name="name" fullWidth />
            <TextInput
              multiline
              fullWidth
              rows={4}
              label="Description"
              spellCheck="false"
              name="description"
            />
            <Grid
              sx={{
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: "4px",
                width: "100%",
                overflow: "auto",
                "&:focus": {
                  borderColor: "#1976d2",
                  boxShadow: "0 0 0 0.2rem #1976d220",
                },
                "&:hover": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <CodeEditor
                value={code}
                language="typescript"
                onChange={handleEditorChange}
              />
            </Grid>
            <Grid
              container
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                href={`/code-items?categoryId=${categoryId}`}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                type="submit"
                isLoading={isLoading}
                href={isLoading ? `/code-items?categoryId=${categoryId}` : ""}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Container>
    </Box>
  );
};

export default CodeItemCreate;
