"use client";

import * as z from "zod";
import { Form } from "../Form";
import { Button } from "../buttons";
import { Grid } from "@mui/material";
import { TextInput } from "../inputs";
import CodeEditor from "../CodeEditor";
import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

interface CodeItemFormProps {
  onSubmit: (data: FieldValues) => Promise<void>;
  isLoading: boolean;
}

export const CodeItemForm = ({ onSubmit, isLoading }: CodeItemFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? "";
  const [code, setCode] = useState<string>("// Write your code");

  const schema = z.object({
    name: z.string().min(1, { message: "Required" }),
    description: z.string(),
  });

  const onCancelBack = () => {
    router.back();
  };
  const onSaveBack = () => {
    if (isLoading) {
      router.back();
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const onSave = async (data: FieldValues) => {
    await onSubmit({ ...data, code });
    router.push(`/code-items?categoryId=${categoryId}`);
  };

  return (
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
              border: "2px solid #1976d2",
            },
            "&:hover": {
              border: "1px solid black",
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
          <Button variant="contained" onClick={onCancelBack}>
            Cancel
          </Button>
          <Button
            variant="contained"
            isLoading={isLoading}
            type="submit"
            onClick={onSaveBack}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};
