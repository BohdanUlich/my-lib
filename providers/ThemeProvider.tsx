"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Roboto_Mono } from "next/font/google";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export const robotoMono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

const theme = createTheme({
  typography: { fontFamily: robotoMono.style.fontFamily },
  palette: {
    contrastThreshold: 4.5,
  },
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
