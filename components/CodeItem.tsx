import Link from "next/link";
import { Edit } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { DeleteCodeItemButton } from "@/components/buttons";
import { ListItem, ListItemButton, ListItemText, styled } from "@mui/material";

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
  [`& .${CodeItemClasses.link}`]: {
    textDecoration: "none",
    color: "inherit",
  },
}));

export const CodeItem = ({ codeItemName, codeItemId }: CodeItemProps) => {
  return (
    <StyledListItem
      className={CodeItemClasses.listItem}
      secondaryAction={
        <>
          <Link
            href={`/code-items/edit/${codeItemId}`}
            className={CodeItemClasses.link}
          >
            <Edit className={CodeItemClasses.editIcon} />
          </Link>

          <DeleteCodeItemButton
            codeItemName={codeItemName}
            codeItemId={codeItemId}
          />
        </>
      }
    >
      <ListItemButton
        component={Link}
        href={`/code-items/show/${codeItemId}`}
        className={CodeItemClasses.listItemButton}
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
