import { useMemo, useRef } from "react";
import { type RichTextEditorRef } from "mui-tiptap";
import { useController } from "react-hook-form";
import { extractImageUrls } from "@/helpers/extractImageUrls";
import { RichTextEditorView } from "./RichTextEditorView";

interface RichTextEditorProps {
  name: string;
  onCollectRemovedImages: (urls: string[]) => void;
}

export const RichTextEditor = ({
  name,
  onCollectRemovedImages,
}: RichTextEditorProps) => {
  const { field } = useController({
    name,
  });

  const rteRef = useRef<RichTextEditorRef>(null);

  const initialImages = useMemo(
    () => extractImageUrls(field.value || ""),
    [field.value]
  );

  const handleChange = async () => {
    const htmlContent = rteRef.current?.editor?.getHTML() || "";
    const currentImages = extractImageUrls(htmlContent);

    // Find removed images
    const removedImages = initialImages.filter(
      (img) => !currentImages.includes(img)
    );

    if (removedImages.length > 0) {
      onCollectRemovedImages(removedImages);
    }

    field.onChange(htmlContent);
  };

  return (
    <RichTextEditorView
      content={field.value}
      onUpdate={handleChange}
      ref={rteRef}
    />
  );
};
