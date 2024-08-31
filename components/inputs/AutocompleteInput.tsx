"use client";

import { Autocomplete, TextField, AutocompleteProps } from "@mui/material";
import { useController } from "react-hook-form";

interface AutocompleteInputProps
  extends Omit<
    AutocompleteProps<string, undefined, undefined, undefined>,
    "options" | "renderInput" | "key"
  > {
  options: string[];
  name: string;
}

export const AutocompleteInput = ({
  options,
  name,
  defaultValue,
  ...rest
}: AutocompleteInputProps) => {
  const { field, fieldState } = useController({
    name,
  });

  return (
    <Autocomplete
      options={options}
      value={field.value ?? null}
      onChange={(_, newValue) => field.onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={fieldState.error?.message ?? ""}
          error={!!fieldState.error}
          label="Select language"
        />
      )}
      {...rest}
    />
  );
};
