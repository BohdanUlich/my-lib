"use client";
import { Grid, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button, Form, TextInput } from "@/components";
import { FieldValues } from "react-hook-form";
import { useSnackbar } from "notistack";

const schema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(1, { message: "Required" }),
  password: z.string().min(6, { message: "Min 6 chars" }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { replace, refresh } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: "error" });
      } else {
        refresh();
        replace("/");
      }
    } catch (err) {
      enqueueSnackbar(`${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form schema={schema} onSubmit={onSubmit}>
      <Grid container gap={2}>
        <Grid item xs={12}>
          <TextInput name="email" label="Email" required fullWidth />
        </Grid>

        <Grid item xs={12}>
          <TextInput
            name="password"
            type="password"
            label="Password"
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
          Sign in
        </Button>

        <Button
          size="large"
          fullWidth
          variant="contained"
          onClick={() => signIn("google", { callbackUrl })}
          startIcon={<GoogleIcon />}
        >
          Sign in with google
        </Button>

        <Grid
          container
          item
          justifyContent="center"
          alignItems="center"
          gap={0.5}
        >
          <Typography>{`Don't have an account?`}</Typography>
          <Link href={{ pathname: "/registration" }}>Sign Up</Link>
        </Grid>
      </Grid>
    </Form>
  );
};

export default Login;
