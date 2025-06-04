/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://my-lib-pro.netlify.app",
  generateRobotsTxt: true,
  outDir: "./public",
  exclude: ["/categories", "/code-items*", "/login", "/registration"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/categories", "/code-items*", "/login", "/registration"],
      },
    ],
  },
  additionalPaths: async () => [
    {
      loc: "/",
      changefreq: "monthly",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    },
  ],
};
