import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types to include the user ID.
   */
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & User;
  }
}
