"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Roboto_Mono } from "next/font/google";
import { createContext, ReactNode, useContext, useState } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export const robotoMono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

const lightTheme = createTheme({
  typography: { fontFamily: robotoMono.style.fontFamily },
  palette: {
    mode: "light",
    contrastThreshold: 4.5,
  },
});

const darkTheme = createTheme({
  typography: { fontFamily: robotoMono.style.fontFamily },
  palette: {
    mode: "dark",
    contrastThreshold: 4.5,
  },
});

const ColorModeContext = createContext({
  toggleTheme: () => {},
  theme: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themeObject = theme === "light" ? lightTheme : darkTheme;

  return (
    <ColorModeContext.Provider value={{ toggleTheme, theme }}>
      <MuiThemeProvider theme={themeObject}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};
