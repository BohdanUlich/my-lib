"use client";
import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  return (
    <SnackbarProvider
      autoHideDuration={3000}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      hideIconVariant
    >
      {children}
    </SnackbarProvider>
  );
};
