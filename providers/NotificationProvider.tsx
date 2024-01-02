"use client";
import { Alert, Snackbar } from "@mui/material";
import {
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface NotificationProviderProps {
  children: ReactNode;
}

interface NotificationContextProps {
  setIsSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackBarMessage: Dispatch<SetStateAction<string>>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackBarMessage] = useState("");

  return (
    <NotificationContext.Provider
      value={{
        setIsSnackbarOpen,
        setSnackBarMessage,
      }}
    >
      {children}

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setIsSnackbarOpen(false)}
        color="error"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
