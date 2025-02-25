import { Box } from "@mui/material";
import { forwardRef } from "react";
import {
  RichTextEditor as Editor,
  LinkBubbleMenu,
  RichTextEditorRef,
  TableBubbleMenu,
} from "mui-tiptap";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "./useExtensions";
import { EditorEvents } from "@tiptap/core";

interface RichTextEditorViewProps {
  content: string;
  onUpdate?: (props: EditorEvents["update"]) => void;
  readonly?: boolean;
}

export const RichTextEditorView = forwardRef<
  RichTextEditorRef,
  RichTextEditorViewProps
>((props, ref) => {
  const { content, readonly, onUpdate } = props;

  const extensions = useExtensions({
    placeholder: "Add your description here...",
  });

  return (
    <Box
      sx={{
        width: 1,
        "& .ProseMirror": {
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            scrollMarginTop: 50,
          },
        },
        img: {
          outline: "none !important",
        },
      }}
    >
      <Editor
        ref={ref}
        extensions={extensions}
        content={content}
        editable={!readonly}
        onUpdate={onUpdate}
        immediatelyRender={false}
        renderControls={() => (readonly ? null : <EditorMenuControls />)}
        RichTextFieldProps={{
          variant: readonly ? "standard" : "outlined",
        }}
      >
        {() => (
          <>
            <LinkBubbleMenu />
            <TableBubbleMenu />
          </>
        )}
      </Editor>
    </Box>
  );
});
RichTextEditorView.displayName = "RichTextEditorView";
