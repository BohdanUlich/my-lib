"use client";
import { LinearProgress } from "@mui/material";
import { useProgress } from "@/providers/ProgressBarProvider";

export const ProgressBar = () => {
  const { loadingProgress } = useProgress();

  return (
    loadingProgress && (
      <LinearProgress
        color="primary"
        sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1200 }}
      />
    )
  );
};
