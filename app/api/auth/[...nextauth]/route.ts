import { authConfig } from "@/configs";
import NextAuth from "next-auth/next";

const handleAuth = NextAuth(authConfig);

export { handleAuth as GET, handleAuth as POST };
