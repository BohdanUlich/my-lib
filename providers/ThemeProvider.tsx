"use client";

import {
  createTheme,
  lighten,
  ThemeProvider as MuiThemeProvider,
  responsiveFontSizes,
  Theme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Inter } from "next/font/google";
import { createContext, useContext, useEffect, useState } from "react";
import { DARK_THEME, LIGHT_THEME } from "@/types";

export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

const typography = {
  fontFamily: inter.style.fontFamily,
  h2: { fontWeight: 500 },
  h3: { fontWeight: 500 },
};

const shape = { borderRadius: 8 };

const componentsOverrides = {
  MuiButton: {
    styleOverrides: {
      root: () => ({
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 13,
        height: "38px",
      }),
      contained: ({ theme }: { theme: Theme }) => ({
        boxShadow: theme.shadows[0],
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }),
      containedPrimary: ({ theme }: { theme: Theme }) => ({
        "&:hover": {
          backgroundColor: lighten(theme.palette.primary.main, 0.15),
        },
      }),
    },
  },
  MuiInput: {
    styleOverrides: {
      underline: {
        border: 0,
        "&&:hover::before": {
          border: 0,
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        padding: "5px 12px",
        display: "flex",
        alignItems: "center",
        boxShadow: theme.shadows[0],
        border: "none",
        height: "38px",
        ".MuiInputBase-input": {
          padding: "4px 0",
          overflow: "hidden",
        },
      }),
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        ".MuiChip-root": {
          height: 27,
          fontSize: 11,
        },
        ".MuiInputBase-root": {
          paddingTop: 2,
          paddingBottom: 1,
          height: "100%",
        },
        ".MuiInputBase-inpput": {
          padding: 0,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        top: "50%",
        transform: "translateY(-50%)",
        left: 12,
        transition: "all 0.2s ease",
      },
      shrink: {
        top: 0,
        transform: "translateY(-50%)",
        fontSize: 12,
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        textDecoration: "none",
        color: theme.palette.secondary.main,
        "&:hover": {
          textDecoration: "none",
          color: theme.palette.secondary.light,
        },
      }),
    },
  },
};

const lightTheme = responsiveFontSizes(
  createTheme({
    typography,
    palette: {
      mode: "light",
      grey: { 400: "#e5e7eb" },
      primary: { main: "#000" },
      secondary: { main: "#008edf", light: "#00afff", dark: "#005caa" },
    },
    shape,
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(5px)",
            boxShadow: "none",
            borderBottom: "1px solid",
            borderColor: theme.palette.grey["400"],
            ".MuiToolbar-root": {
              minHeight: 56,
            },
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: "none",
            height: "100%",
            border: "1px solid",
            borderColor: theme.palette.grey[400],
            "&:hover": {
              boxShadow: theme.shadows[3],
            },
          }),
        },
      },
      ...componentsOverrides,
    },
  })
);

const darkTheme = createTheme({
  typography,
  palette: {
    mode: "dark",
    background: {
      default: "#1e1e1e",
    },
    grey: { 400: "#3a3a3a" },
    primary: { main: "#ed8002" },
    secondary: { main: "#008edf", light: "#00afff", dark: "#005caa" },
  },
  shape,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          opacity: 0.95,
          backdropFilter: "blur(5px)",
          boxShadow: "none",
          borderBottom: "1px solid",
          borderColor: theme.palette.grey["400"],
          backgroundImage: "none",
          ".MuiToolbar-root": {
            minHeight: 56,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: "100%",
          boxShadow: "none",
          border: "1px solid",
          borderColor: theme.palette.grey[400],
          "&:hover": {
            borderColor: "#fff",
          },
        }),
      },
    },
    MuiPopper: {
      styleOverrides: {
        root: {
          ".MuiAutocomplete-listbox": {
            background: "#2e2e2e",
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          ".MuiBox-root": {
            background: "#2e2e2e",
          },
        },
      },
    },
    ...componentsOverrides,
  },
});

const ColorModeContext = createContext({
  toggleTheme: () => {},
  theme: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || LIGHT_THEME;
    setTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  if (!theme) {
    return null;
  }

  const themeObject = theme === LIGHT_THEME ? lightTheme : darkTheme;

  return (
    <ColorModeContext.Provider value={{ toggleTheme, theme }}>
      <MuiThemeProvider theme={themeObject}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};
