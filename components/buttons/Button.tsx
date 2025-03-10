"use client";

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";

export type ButtonProps = MuiButtonProps & {
  isLoading?: boolean;
};

export const Button = ({
  children,
  isLoading,
  disabled,
  startIcon,
  sx,
  ...rest
}: ButtonProps) => {
  return (
    <MuiButton
      disabled={isLoading || disabled}
      sx={{ textTransform: "initial", ...sx }}
      {...rest}
      startIcon={
        isLoading ? (
          <CircularProgress sx={{ color: "white" }} size={20} />
        ) : (
          startIcon
        )
      }
    >
      {children}
    </MuiButton>
  );
};
