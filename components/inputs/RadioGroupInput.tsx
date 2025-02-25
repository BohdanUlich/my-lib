import {
  Box,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  RadioGroupProps,
  SxProps,
} from "@mui/material";
import { useController } from "react-hook-form";

type RadioGroupInputProps = RadioGroupProps & {
  name: string;
  defaultValue?: string;
  choices: { value: string; label: string }[];
  label?: string;
  sx?: SxProps;
};

export const RadioGroupInput = ({
  name,
  defaultValue,
  choices,
  label,
  sx,
  ...rest
}: RadioGroupInputProps) => {
  const { field } = useController({
    name,
    defaultValue,
  });

  return (
    <Box sx={sx}>
      {label && <FormLabel id={name}>{label}</FormLabel>}

      <RadioGroup
        aria-labelledby={name}
        defaultValue={defaultValue}
        name={name}
        value={field.value}
        onChange={field.onChange}
        {...rest}
      >
        {choices.map((choice) => {
          return (
            <FormControlLabel
              value={choice.value}
              label={choice.label}
              key={choice.value}
              control={<Radio />}
            />
          );
        })}
      </RadioGroup>
    </Box>
  );
};
