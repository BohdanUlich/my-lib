"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface NextAuthProviderProps {
  children: ReactNode;
}

export const NextAuthProvider = (props: NextAuthProviderProps) => {
  const { children } = props;

  return <SessionProvider>{children}</SessionProvider>;
};
