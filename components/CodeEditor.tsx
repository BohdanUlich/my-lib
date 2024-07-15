import React from "react";
import MonacoEditor from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
}) => {
  return (
    <MonacoEditor
      height="300px"
      width="100%"
      language={language}
      value={value}
      onChange={onChange}
      options={{
        selectOnLineNumbers: true,
      }}
    />
  );
};

export default CodeEditor;
