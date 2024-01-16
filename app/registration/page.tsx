"use client";
import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import Link from "next/link";
import * as z from "zod";
import { FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Form, TextInput } from "@/components";
import { useNotification } from "@/providers";
import { fetchService } from "@/services";

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(1, { message: "Required" }),
  password: z.string().min(6, { message: "Min 6 chars" }),
});

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setSnackBarMessage, setIsSnackbarOpen } = useNotification();

  const { push } = useRouter();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    const response = await fetchService("auth/users", { method: "POST", data });

    setIsLoading(false);

    if (response.error) {
      setSnackBarMessage(`${response?.error}`);
      setIsSnackbarOpen(true);
      return response;
    }

    if (response.user) push("/");
  };

  return (
    <Form schema={schema} onSubmit={onSubmit}>
      <Grid container gap={2}>
        <Grid item xs={12}>
          <TextInput name="name" label="Name" required fullWidth />
        </Grid>

        <Grid item xs={12}>
          <TextInput label="Email Address" name="email" required fullWidth />
        </Grid>

        <Grid item xs={12}>
          <TextInput
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            fullWidth
          />
        </Grid>

        <Button
          type="submit"
          size="large"
          fullWidth
          variant="contained"
          isLoading={isLoading}
        >
          Sign Up
        </Button>

        <Grid
          container
          item
          alignItems="center"
          gap={0.5}
          justifyContent="center"
        >
          <Typography>Already have an account?</Typography>
          <Link href={{ pathname: "/login" }}>Sign in</Link>
        </Grid>
      </Grid>
    </Form>
  );
};

export default Registration;
