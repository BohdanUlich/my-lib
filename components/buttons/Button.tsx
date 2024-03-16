import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";

type ButtonProps = MuiButtonProps & {
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
        isLoading ? <CircularProgress color="inherit" size={20} /> : startIcon
      }
    >
      {children}
    </MuiButton>
  );
};
