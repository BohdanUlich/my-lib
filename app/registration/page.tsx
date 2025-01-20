"use client";
import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import * as z from "zod";
import { FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Form, TextInput, Link } from "@/components";
import { fetchService } from "@/services";
import { useSnackbar } from "notistack";
import { signIn } from "next-auth/react";

const schema = z
  .object({
    name: z.string().min(1, { message: "Required" }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(1, { message: "Required" }),
    password: z.string().min(6, { message: "Min 6 chars" }),
    confirm_password: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { replace, refresh } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    const response = await fetchService("auth/users", { method: "POST", data });

    setIsLoading(false);

    if (response.error) {
      enqueueSnackbar(`${response?.error}`, { variant: "error" });
      return response;
    }

    if (response.user) {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!result?.error && result?.status === 200) {
        enqueueSnackbar("Sign up successful. Welcome to My lib", {
          variant: "success",
        });

        refresh();
        replace("/");
      } else {
        enqueueSnackbar(result?.error, { variant: "error" });
      }
    }
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

        <Grid item xs={12}>
          <TextInput
            name="confirm_password"
            label="Confirm Password"
            type="password"
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
