import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "@/services";
import User from "@/models/user";
import { z } from "zod";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { UserDocument } from "@/app/api/auth/users/route";
import { Session } from "next-auth";

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

          let currentUser = await User.findOne({ email });

          if (!currentUser) {
            currentUser = new User({
              name,
              email,
            });

            await currentUser.save();

            user.id = currentUser._id.toString();

            return true;
          }

          user.id = currentUser._id.toString();

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      let customSession: any = session;

      if (token.userId) {
        customSession.user.id = token.userId;
      }

      return customSession as Session;
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
