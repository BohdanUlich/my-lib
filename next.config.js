import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  serverExternalPackages: ["mongoose"],
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

module.exports = nextConfig;
