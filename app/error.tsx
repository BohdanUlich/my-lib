"use client";
import { Box } from "@mui/material";

const ErrorWrapper = (props: Error) => {
  const { message } = props;

  return <Box>{message}</Box>;
};

export default ErrorWrapper;
