"use client";

import {
  Box,
  Modal as MuiModal,
  ModalProps as MuiModalProps,
} from "@mui/material";
import { ReactNode } from "react";

interface ModalProps extends Omit<MuiModalProps, "children"> {
  children: ReactNode;
  onClose: () => void;
}

export const Modal = ({ children, open, onClose }: ModalProps) => {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
        }}
      >
        {children}
      </Box>
    </MuiModal>
  );
};
