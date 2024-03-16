import { Box, Tooltip, Typography } from "@mui/material";

interface LabelProps {
  labelName: string;
  labelColor: string;
  colorToken: string;
}

export const Label = ({ labelName, labelColor, colorToken }: LabelProps) => {
  return (
    <Tooltip title={labelName}>
      <Box
        display="flex"
        overflow="hidden"
        alignItems="center"
        sx={{
          p: 0.4,
          backgroundColor: `${labelColor}.${colorToken}`,
          borderRadius: 1,
        }}
      >
        <Typography
          fontSize={10}
          color={`${labelColor}.contrastText`}
          sx={{
            textWrap: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {labelName}
        </Typography>
      </Box>
    </Tooltip>
  );
};
