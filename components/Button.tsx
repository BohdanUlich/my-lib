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
  ...rest
}: ButtonProps) => {
  return (
    <MuiButton
      disabled={isLoading || disabled}
      {...rest}
      startIcon={
        isLoading ? <CircularProgress color="inherit" size={20} /> : startIcon
      }
    >
      {children}
    </MuiButton>
  );
};
