/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  serverExternalPackages: ["mongoose"],
  headers: () => [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store, max-age=0, must-revalidate",
        },
        {
          key: "CDN-Cache-Control",
          value: "no-store, max-age=0, must-revalidate",
        },
        {
          key: "Netlify-CDN-Cache-Control",
          value: "no-store, max-age=0, must-revalidate",
        },
      ],
    },
  ],
};

module.exports = nextConfig;
