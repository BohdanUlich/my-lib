import {
  NextAuthProvider,
  NotificationProvider,
  QueryClientProvider,
} from "@/providers";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/providers";

export const metadata: Metadata = {
  title: "Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <NextAuthProvider>
            <ThemeProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </ThemeProvider>
          </NextAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
