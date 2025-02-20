"use client";

import {
  Box,
  Chip,
  Checkbox,
  TextField,
  Autocomplete,
  AutocompleteProps,
} from "@mui/material";
import { DARK_TEXT, Label } from "@/types";
import { useController } from "react-hook-form";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { getTextColor } from "@/helpers/getTextColor";

interface LabelsAutocompleteArrayInputProps
  extends Omit<
    AutocompleteProps<Label, undefined, undefined, undefined>,
    "options" | "renderInput" | "key"
  > {
  options?: Label[];
  name: string;
}

export const LabelsAutocompleteArrayInput = ({
  options,
  name,
}: LabelsAutocompleteArrayInputProps) => {
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

  const { field, fieldState } = useController({
    name,
  });

  const transformedOptions = options?.map(
    ({ id, name, color, text_color }) => ({
      id,
      name,
      color,
      textColor: text_color,
    })
  );

  const selectedOptions =
    transformedOptions?.filter((option) => field.value?.includes(option.id)) ??
    [];

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={transformedOptions || []}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      value={selectedOptions}
      onChange={(_, newValue) => {
        const newIds = newValue.map((option) => option.id);
        field.onChange(newIds);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.name}
            {...getTagProps({ index })}
            key={option.id}
            sx={{
              backgroundColor: option.color,
              color: getTextColor({ textColor: option.textColor }),
              "& .MuiChip-deleteIcon": {
                color: option.textColor === DARK_TEXT ? "#878787" : "#fff",
                "&:hover": {
                  color: option.textColor === DARK_TEXT ? "#000" : "#c4c4c4",
                },
              },
            }}
          />
        ))
      }
      renderOption={(props, option, { selected }) => {
        const { ...optionProps } = props;
        return (
          <li {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
            <Box
              width={10}
              height={10}
              borderRadius="50%"
              bgcolor={option.color}
              marginLeft={1}
            ></Box>
          </li>
        );
      }}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={fieldState.error?.message ?? ""}
          error={!!fieldState.error}
          label="Select labels"
        />
      )}
    />
  );
};
