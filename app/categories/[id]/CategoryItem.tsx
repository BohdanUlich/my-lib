"use client";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { Edit } from "@mui/icons-material";
import { Grid, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { grey } from "@mui/material/colors";

export const CategoryItem = () => {
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
        <ListItemText primary="Just text for test" />
        <Grid onMouseDown={(e) => e.stopPropagation()}>
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
        </Grid>
        <Grid onMouseDown={(e) => e.stopPropagation()}>
          <VisibilityIcon
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
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
