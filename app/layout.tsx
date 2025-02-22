import { ReactNode } from "react";
import type { Metadata } from "next";
import {
  CategoriesProvider,
  NextAuthProvider,
  NotificationProvider,
  ProgressBarProvider,
  QueryClientProvider,
} from "@/providers";
import "./globals.css";
import { ThemeProvider } from "@/providers";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "My Lib",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <NextAuthProvider>
            <ThemeProvider>
              <NotificationProvider>
                <CategoriesProvider>
                  <ProgressBarProvider>
                    <Header />
                    <ProgressBar />
                    {children}
                  </ProgressBarProvider>
                </CategoriesProvider>
              </NotificationProvider>
            </ThemeProvider>
          </NextAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
