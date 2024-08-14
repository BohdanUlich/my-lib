import { useEffect } from "react";
import { Grid } from "@mui/material";
import { DARK_THEME } from "@/types";
import { useColorMode } from "@/providers";
import { useController, useWatch } from "react-hook-form";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";

interface MonacoEditorProps {
  name: string;
  defaultValue?: string;
}

export const CodeEditor = ({ name, defaultValue }: MonacoEditorProps) => {
  const { theme } = useColorMode();
  const language = useWatch({ name: "language" });
  const monaco = useMonaco();

  const { field } = useController({
    name,
    defaultValue,
  });

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
        value={field.value}
        onChange={field.onChange}
      />
    </Grid>
  );
};
