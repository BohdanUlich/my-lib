"use client";
import { useState, MouseEvent } from "react";
import { signOut } from "next-auth/react";
import {
  Menu,
  MenuItem,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Avatar,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { useGetUser } from "@/hooks";

export const Header = () => {
  const { userName, userImage, userId, userEmail } = useGetUser();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const onOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const onCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              display: "flex",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MY LIB
          </Typography>

          {userId && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={onOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={userName} src={userImage ?? userName} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: 5.62 }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={onCloseUserMenu}
              >
                <Typography
                  textAlign="center"
                  variant="subtitle2"
                  sx={{ px: 2, py: 0.75 }}
                >
                  {userEmail}
                </Typography>

                <MenuItem onClick={() => signOut()}>
                  <Typography textAlign="center" color="primary">
                    Log out
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
