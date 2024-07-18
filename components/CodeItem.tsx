"use client";

import Link from "next/link";
import { Edit } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { DeleteCodeItemButton } from "./buttons";
import { useSearchParams } from "next/navigation";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";

interface CodeItemProps {
  codeItemName: string;
  codeItemId: string;
}

export const CodeItem = ({ codeItemName, codeItemId }: CodeItemProps) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? "";

  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  return (
    <ListItem
      sx={{
        padding: 0,
        borderBottom: "1px solid",
        borderColor: "grey.300",
        "&:hover": {
          ".MuiSvgIcon-root": {
            opacity: 1,
          },
        },
      }}
    >
      <ListItemButton
        sx={{
          height: 70,
        }}
      >
        <ListItemText primary={codeItemName} />

        <Link
          href={`/code-items/edit/${codeItemId}?categoryId=${categoryId}`}
          onMouseDown={(e) => e.stopPropagation()}
          style={linkStyle}
        >
          <Edit
            sx={{
              height: 28,
              width: 28,
              opacity: 0,
              transition: "0.1s all linear",
              borderRadius: "50%",
              padding: 0.6,
              "&:hover": {
                backgroundColor: grey[200],
              },
            }}
          />
        </Link>
        <DeleteCodeItemButton
          codeItemName={codeItemName}
          codeItemId={codeItemId}
        />
      </ListItemButton>
    </ListItem>
  );
};
