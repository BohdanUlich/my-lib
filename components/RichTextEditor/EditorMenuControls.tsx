import { uploadImages } from "@/helpers/uploadImages";
import { useTheme } from "@mui/material";
import {
  MenuButtonAddTable,
  MenuButtonBold,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonHorizontalRule,
  MenuButtonImageUpload,
  MenuButtonItalic,
  MenuButtonRedo,
  MenuButtonTaskList,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontSize,
  MenuSelectHeading,
  MenuSelectTextAlign,
} from "mui-tiptap";

export default function EditorMenuControls() {
  const theme = useTheme();

  return (
    <MenuControlsContainer>
      <MenuSelectHeading />

      <MenuDivider />

      <MenuSelectFontSize />

      <MenuDivider />

      <MenuButtonBold />

      <MenuButtonItalic />

      <MenuButtonUnderline />

      <MenuDivider />

      <MenuButtonTextColor
        defaultTextColor={theme.palette.text.primary}
        swatchColors={[
          { value: "#000000", label: "Black" },
          { value: "#ffffff", label: "White" },
          { value: "#888888", label: "Grey" },
          { value: "#ff0000", label: "Red" },
          { value: "#ff9900", label: "Orange" },
          { value: "#ffff00", label: "Yellow" },
          { value: "#00d000", label: "Green" },
          { value: "#0000ff", label: "Blue" },
        ]}
      />

      <MenuDivider />

      <MenuSelectTextAlign />

      <MenuDivider />

      <MenuButtonEditLink />

      <MenuDivider />

      <MenuButtonTaskList />

      <MenuDivider />

      <MenuButtonCode />

      <MenuButtonCodeBlock />

      <MenuDivider />

      <MenuButtonImageUpload
        onUploadFiles={(files) => {
          return uploadImages(files);
        }}
        type="button"
      />

      <MenuDivider />

      <MenuButtonHorizontalRule />

      <MenuDivider />

      <MenuButtonAddTable />

      <MenuDivider />

      <MenuButtonUndo />

      <MenuButtonRedo />
    </MenuControlsContainer>
  );
}
