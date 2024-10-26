"use client";

import { useController, useWatch } from "react-hook-form";
import { CodeEditorView } from "./CodeEditorView";

interface MonacoEditorProps {
  name: string;
  defaultValue?: string;
}

export const CodeEditor = ({ name, defaultValue }: MonacoEditorProps) => {
  const language = useWatch({ name: "language" });

  const { field } = useController({
    name,
    defaultValue,
  });

  return (
    <CodeEditorView
      language={language ?? "typescript"}
      value={field.value}
      onChange={field.onChange}
    />
  );
};
