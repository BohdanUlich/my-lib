import { TextField, TextFieldProps } from "@mui/material";
import { useController } from "react-hook-form";

type TextInputProps = TextFieldProps & {
  name: string;
  defaultValue?: string;
};

export const TextInput = ({
  name,
  defaultValue = "",
  ...rest
}: TextInputProps) => {
  const { field, fieldState } = useController({
    name,
    defaultValue,
  });

  return (
    <TextField
      helperText={fieldState.error?.message ?? ""}
      error={!!fieldState.error}
      {...rest}
      {...field}
    />
  );
};
