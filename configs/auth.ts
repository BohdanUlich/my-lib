import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "@/lib";
import User from "@/models/user";
import { z } from "zod";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { UserDocument } from "@/app/api/auth/users/route";

async function getUser(email: string): Promise<UserDocument | undefined> {
  try {
    await connectDb();
    const user = await User.findOne({ email });

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user?.password ?? ""
          );

          if (!passwordsMatch) throw Error("Email or password mismatch");

          return {
            name: user.name,
            email: user.email,
            id: user._id.toString(),
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === "google") {
        const { name, email } = user;

        try {
          await connectDb();

          const userExists = await User.findOne({ email });

          if (!userExists) {
            const res = await fetch("http://localhost:3000/api/user", {
              method: "POSt",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
                email,
              }),
            });

            if (res.status === 200) return user;

            return null;
          }
        } catch (err) {
          console.log(err);
        }
      }
      return user;
    },
    jwt(params: any) {
      if (params.user) {
        params.token.id = params.user.id;
      }

      return params.token;
    },
    session({ session, token }) {
      console.log("session, token", session, token);

      if (session?.user) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/registration",
  },
};
