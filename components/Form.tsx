"use client";

import { ZodType } from "zod";
import { setFormErrors } from "@/helpers";
import { Box, SxProps } from "@mui/material";
import { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

interface FormParams {
  children: ReactNode;
  schema: ZodType;
  onSubmit: (data: any) => Promise<{ error: string; details: any[] } | void>;
  defaultValues?: Record<string, any>;
  sx?: SxProps;
}

export const Form = ({
  children,
  schema,
  onSubmit,
  defaultValues,
  sx,
}: FormParams) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: unknown) => {
    const res = await onSubmit(values);

    if (res?.error) {
      setFormErrors(res.details, form.setError);
    }
  };

  const handleError = () => {
    enqueueSnackbar("Form is not valid", { variant: "error" });
  };

  return (
    <FormProvider {...form}>
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(handleSubmit, handleError)}
        onInvalid={() => handleError()}
        sx={sx}
      >
        {children}
      </Box>
    </FormProvider>
  );
};
