"use client";

import * as z from "zod";
import { useGetLabels } from "@/api";
import { Grid } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useMonaco } from "@monaco-editor/react";
import { CODE_ITEM_TYPE, CodeItem, IMAGES_API_ENDPOINT } from "@/types";
import { CodeEditor } from "./CodeEditor";
import { CodeItemModals } from "./CodeItemModals";
import { Form } from "../Form";
import { Button } from "../buttons";
import { AutocompleteInput, TextInput } from "../inputs";
import { LabelsAutocompleteArrayInput } from "../labels";
import { RichTextEditor } from "../RichTextEditor";
import { fetchService } from "@/services";

interface CodeItemFormProps {
  onSubmit: (data: FieldValues) => Promise<void>;
  isLoading: boolean;
  codeItem?: CodeItem;
}

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().optional(),
  language: z.string().min(1, { message: "Required" }),
  code: z.string(),
  label_ids: z.array(z.string()).optional(),
});

export const CodeItemForm = ({
  onSubmit,
  isLoading,
  codeItem,
}: CodeItemFormProps) => {
  const monaco = useMonaco();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const labelType = CODE_ITEM_TYPE;
  const { data: labels } = useGetLabels({ labelType });
  const removedImagesRef = useRef<string[]>([]);

  const handleCollectRemovedImages = (urls: string[]) => {
    removedImagesRef.current = [...removedImagesRef.current, ...urls];
  };

  const [languages, setLanguages] = useState<string[]>([]);
  const [isEditLabelsModalOpen, setIsEditLabelsModalOpen] = useState(false);

  useEffect(() => {
    if (monaco) {
      setLanguages(monaco.languages.getLanguages().map((lang) => lang.id));
    }
  }, [codeItem, monaco]);

  const goBackToList = () => {
    push(`/code-items?categoryId=${categoryId}`);
  };

  const onSave = async (data: FieldValues) => {
    try {
      // Delete removed images if there are any
      if (removedImagesRef.current.length > 0) {
        await fetchService(IMAGES_API_ENDPOINT, {
          method: "DELETE",
          data: { urls: removedImagesRef.current },
        });
      }

      await onSubmit({
        ...data,
      });
    } finally {
      goBackToList();
    }
  };

  return (
    <>
      <CodeItemModals
        codeItemId={codeItem?.id}
        labelType={CODE_ITEM_TYPE}
        isEditLabelsModalOpen={isEditLabelsModalOpen}
        setIsEditLabelsModalOpen={setIsEditLabelsModalOpen}
      />

      <Form
        schema={schema}
        onSubmit={onSave}
        defaultValues={{
          name: codeItem?.name,
          description: codeItem?.description,
          code: codeItem?.code,
          language: codeItem?.language,
          label_ids: codeItem?.label_ids,
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

          <RichTextEditor
            name="description"
            onCollectRemovedImages={handleCollectRemovedImages}
          />

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={1.5}
          >
            <Grid item xs={10}>
              <LabelsAutocompleteArrayInput options={labels} name="label_ids" />
            </Grid>

            <Grid item xs={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setIsEditLabelsModalOpen(true)}
              >
                Edit Labels
              </Button>
            </Grid>
          </Grid>

          <AutocompleteInput
            name="language"
            options={languages}
            defaultValue="apex"
            fullWidth
          />

          <CodeEditor name="code" defaultValue="// Write your code" />

          <Grid container sx={{ justifyContent: "space-between" }}>
            <Button variant="contained" onClick={goBackToList}>
              Cancel
            </Button>

            <Button variant="contained" isLoading={isLoading} type="submit">
              Save
            </Button>
          </Grid>
        </Grid>
      </Form>
    </>
  );
};
