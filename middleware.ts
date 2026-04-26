export { default as middleware } from "next-auth/middleware";

export const config = {
  matcher: ["/categories", "/code-items/:path*"],
};
