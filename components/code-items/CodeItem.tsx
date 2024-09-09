"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListItem, ListItemButton, ListItemText, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Edit, Delete } from "@mui/icons-material";
import { DeleteCodeItemButton } from "./DeleteCodeItemButton";
import { useProgress } from "@/providers/ProgressBarProvider";

interface CodeItemProps {
  codeItemName: string;
  codeItemId: string;
}

const CodeItemClasses = {
  listItem: "code-item-list-item",
  listItemButton: "code-item-list-item-button",
  editIcon: "code-item-edit-icon",
  link: "code-item-link",
};

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  "&:hover .MuiSvgIcon-root": {
    opacity: 1,
  },

  [`& .${CodeItemClasses.listItemButton}`]: {
    height: 70,
  },
  [`& .${CodeItemClasses.editIcon}`]: {
    height: 28,
    width: 28,
    opacity: 0,
    transition: "0.1s all linear",
    borderRadius: "50%",
    padding: theme.spacing(0.6),
    "&:hover": {
      backgroundColor: grey[200],
    },
  },
}));

export const CodeItem = ({ codeItemName, codeItemId }: CodeItemProps) => {
  const { push } = useRouter();
  const { setLoadingProgress } = useProgress();

  const onRedirectToEdit = () => {
    setLoadingProgress(true);
    push(`/code-items/edit/${codeItemId}`);
  };

  const onRedirectToShow = () => {
    setLoadingProgress(true);
    push(`/code-items/show/${codeItemId}`);
  };

  return (
    <StyledListItem
      className={CodeItemClasses.listItem}
      secondaryAction={
        <>
          <Edit
            className={CodeItemClasses.editIcon}
            onClick={onRedirectToEdit}
          />

          <DeleteCodeItemButton
            codeItemName={codeItemName}
            codeItemId={codeItemId}
            sx={{
              all: "unset",
              borderRadius: "50%",
              height: 28,
              width: 28,
            }}
          >
            <Delete
              onMouseDown={(e) => e.stopPropagation()}
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
          </DeleteCodeItemButton>
        </>
      }
    >
      <ListItemButton
        className={CodeItemClasses.listItemButton}
        onClick={onRedirectToShow}
      >
        <ListItemText
          primary={codeItemName}
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            wordBreak: "break-word",
            marginRight: 3,
          }}
        />
      </ListItemButton>
    </StyledListItem>
  );
};
