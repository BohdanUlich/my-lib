"use client";

import { useColorMode } from "@/providers";
import { DARK_THEME } from "@/types";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import MonacoEditor, { OnChange, useMonaco } from "@monaco-editor/react";

interface MonacoEditorProps {
  language: string;
  value?: string;
  onChange?: OnChange;
  readOnly?: boolean;
}

export const CodeEditorView = ({
  language,
  value,
  onChange,
  readOnly,
}: MonacoEditorProps) => {
  const { theme } = useColorMode();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.React,
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
      });

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.React,
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
      });
    }
  }, [monaco]);

  return (
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
      <MonacoEditor
        theme={theme === DARK_THEME ? "vs-dark" : "vs"}
        height="500px"
        width="100%"
        language={language ?? "typescript"}
        value={value}
        onChange={onChange}
        options={{ readOnly }}
      />
    </Grid>
  );
};
