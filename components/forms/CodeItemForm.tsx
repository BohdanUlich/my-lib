import * as z from "zod";
import { CodeItem } from "@/types";
import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import {
  AutocompleteInput,
  Button,
  CodeEditor,
  TextInput,
  Form,
} from "@/components";
import { useMonaco } from "@monaco-editor/react";

interface CodeItemFormProps {
  onSubmit: (data: FieldValues) => Promise<void>;
  isLoading: boolean;
  codeItem?: CodeItem;
}

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string(),
  language: z.string().min(1, { message: "Required" }),
  code: z.string(),
});

export const CodeItemForm = ({
  onSubmit,
  isLoading,
  codeItem,
}: CodeItemFormProps) => {
  const { back } = useRouter();

  const [languages, setLanguages] = useState<string[]>([]);

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      setLanguages(monaco.languages.getLanguages().map((lang) => lang.id));
    }
  }, [codeItem, monaco]);

  const onSave = async (data: FieldValues) => {
    try {
      await onSubmit({ ...data });
    } finally {
      back();
    }
  };

  return (
    <Form
      schema={schema}
      onSubmit={onSave}
      defaultValues={{
        name: codeItem?.name,
        description: codeItem?.description,
        code: codeItem?.code,
        language: codeItem?.language,
      }}
      sx={{ width: 1 }}
    >
      <Grid
        container
        sx={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          rowGap: 1.5,
        }}
      >
        <TextInput label="Name" spellCheck="false" name="name" fullWidth />

        <TextInput
          multiline={true}
          fullWidth
          rows={4}
          label="Description"
          name="description"
        />

        <AutocompleteInput
          name="language"
          options={languages}
          defaultValue="typescript"
          fullWidth
        />

        <CodeEditor name="code" defaultValue="// Write your code" />

        <Grid container sx={{ justifyContent: "space-between" }}>
          <Button variant="contained" onClick={back}>
            Cancel
          </Button>

          <Button variant="contained" isLoading={isLoading} type="submit">
            Save
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};
