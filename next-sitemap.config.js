/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://my-lib-pro.netlify.app",
  generateRobotsTxt: true,
  outDir: "./public",
  exclude: ["/", "/code-items*", "/login", "/registration"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/about",
        disallow: ["/", "/code-items*", "/login", "/registration"],
      },
    ],
  },

  transform: async (config, path) => {
    const defaultEntry = {
      loc: path,
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };

    if (path === "/about") {
      return {
        ...defaultEntry,
        changefreq: "monthly",
        priority: 0.9,
      };
    }

    return defaultEntry;
  },
};
