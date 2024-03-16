"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider as QueryProvider } from "react-query";

interface QueryClientProviderProps {
  children: ReactNode;
}

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const queryClient = new QueryClient();

  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
};
