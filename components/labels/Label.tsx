import { Box, Tooltip, Typography } from "@mui/material";
import { getTextColor } from "@/helpers/getTextColor";

interface LabelProps {
  labelName: string;
  labelColor: string;
  textColor: string;
}

export const Label = ({ labelName, labelColor, textColor }: LabelProps) => {
  return (
    <Tooltip title={labelName}>
      <Box
        display="flex"
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        sx={{
          p: 0.4,
          backgroundColor: labelColor,
          borderRadius: 1,
        }}
      >
        <Typography
          fontSize={10}
          color={getTextColor({ textColor })}
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
