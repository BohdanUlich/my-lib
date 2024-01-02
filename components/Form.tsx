import { setFormErrors } from "@/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, SxProps } from "@mui/material";
import React, { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ZodObject, ZodRawShape } from "zod";

interface FormParams {
  children: ReactNode;
  schema: ZodObject<ZodRawShape>;
  onSubmit: (data: any) => Promise<{ error: string; details: any[] } | void>;
  sx?: SxProps;
}

export const Form = ({ children, schema, onSubmit, sx }: FormParams) => {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (values: unknown) => {
    if (!onSubmit) {
      return;
    }
    const res = await onSubmit(values);
    if (res?.error) {
      setFormErrors(res.details, form.setError);
    }
  };

  return (
    <FormProvider {...form}>
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(handleSubmit)}
        sx={sx}
      >
        {children}
      </Box>
    </FormProvider>
  );
};
