"use client";
import { useState, MouseEvent } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  Menu,
  MenuItem,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  Switch,
  Container,
} from "@mui/material";
import { useGetUser } from "@/hooks";
import { useColorMode } from "@/providers";

export const Header = () => {
  const { userName, userImage, userId, userEmail } = useGetUser();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { theme, toggleTheme } = useColorMode();

  const onOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const onCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 9 }}>
      <Container maxWidth="lg">
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
            color="primary"
            sx={{
              display: "flex",
              fontWeight: 700,
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

                <Box display="flex" alignItems="center" gap={1}>
                  <Switch checked={theme === "dark"} onChange={toggleTheme} />
                  <Typography variant="subtitle2">Dark mode</Typography>
                </Box>

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
