"use client";

import {
  Box,
  styled,
  ListItem,
  Typography,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Label } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { grey } from "@mui/material/colors";
import { Edit, Delete } from "@mui/icons-material";
import { useProgress } from "@/providers/ProgressBarProvider";
import { DeleteCodeItemButton } from "./DeleteCodeItemButton";

interface CodeItemProps {
  codeItemLabels: Label[];
  codeItemName: string;
  codeItemId: string;
}

const CodeItemClasses = {
  labelsContainer: "code-item-labels-container",
  listItemButton: "code-item-list-item-button",
  editIcon: "code-item-edit-icon",
  listItem: "code-item-list-item",
  container: "code-item-container",
  label: "code-item-label",
  link: "code-item-link",
  text: "code-item-text",
};

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  padding: 0,
  [`& .${CodeItemClasses.listItemButton}`]: {
    flexGrow: 0,
    width: "100%",
    minHeight: 70,
    columnGap: "10px",
    justifyContent: "space-between",
  },
  [`& .${CodeItemClasses.editIcon}`]: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    padding: theme.spacing(0.6),
    transition: "0.1s all linear",
    "&:hover": {
      backgroundColor: grey[200],
    },
  },
  [`& .${CodeItemClasses.labelsContainer}`]: {
    maxWidth: 150,
    display: "flex",
    overflowX: "auto",
    borderRadius: "5px",
    "::-webkit-scrollbar": {
      height: "10px",
    },
    "::-webkit-scrollbar-thumb": {
      width: "auto",
      borderRadius: "5px",
      boxShadow: "inset 0 0 10px 10px #b8b6b6",
      border: "solid 3px transparent",
      cursor: "pointer",

      ":hover": {
        boxShadow: "inset 0 0 10px 10px #999999",
      },
    },

    "::-webkit-scrollbar-track": {
      borderRadius: "5px",
      boxShadow: "inset  0 -10px 10px #f1f1f1",
      border: "solid 3px transparent",
    },
  },
  [`& .${CodeItemClasses.label}`]: {
    marginRight: "3px",
    borderRadius: "4px",
    padding: "3px 5px 3px 5px",
    maxWidth: "135px",
    p: {
      fontSize: "14px !important",
      whiteSpace: "nowrap",
      overflow: "hidden",
      wordBreak: "break-word",
      textAlign: "center",
      textOverflow: "ellipsis",
      lineHeight: 1.3,
    },
  },
  [`& .${CodeItemClasses.container}`]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 1.5,
  },
  [`& .${CodeItemClasses.text}`]: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 1,
    overflow: "hidden",
    wordBreak: "break-word",
    marginRight: 3,
  },
}));

export const CodeItem = ({
  codeItemId,
  codeItemName,
  codeItemLabels,
}: CodeItemProps) => {
  const { push } = useRouter();
  const { setLoadingProgress } = useProgress();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const onRedirectToEdit = () => {
    setLoadingProgress(true);
    push(`/code-items/edit/${codeItemId}?categoryId=${categoryId}`);
  };

  const onRedirectToShow = () => {
    setLoadingProgress(true);
    push(`/code-items/show/${codeItemId}?categoryId=${categoryId}`);
  };

  return (
    <StyledListItem
      className={CodeItemClasses.listItem}
      secondaryAction={
        <Box className={CodeItemClasses.container}>
          <Box
            onMouseDown={(e) => e.stopPropagation()}
            className={CodeItemClasses.labelsContainer}
          >
            {codeItemLabels.map((label) => (
              <Box
                className={CodeItemClasses.label}
                bgcolor={label.color}
                key={label.id}
              >
                <Typography>{label.name}</Typography>
              </Box>
            ))}
          </Box>

          <Box display="flex">
            <Edit
              className={CodeItemClasses.editIcon}
              onClick={onRedirectToEdit}
            />

            <DeleteCodeItemButton
              disableRipple
              codeItemName={codeItemName}
              codeItemId={codeItemId}
              sx={{
                padding: 0,
                color: "black",
                "&:hover": { background: 0 },
                minWidth: 0,
              }}
            >
              <Delete
                onMouseDown={(e) => e.stopPropagation()}
                sx={{
                  height: 28,
                  width: 28,
                  borderRadius: "50%",
                  padding: 0.6,
                  "&:hover": {
                    backgroundColor: grey[200],
                  },
                }}
              />
            </DeleteCodeItemButton>
          </Box>
        </Box>
      }
    >
      <ListItemButton
        className={CodeItemClasses.listItemButton}
        onClick={onRedirectToShow}
      >
        <ListItemText primary={codeItemName} className={CodeItemClasses.text} />
      </ListItemButton>
    </StyledListItem>
  );
};
