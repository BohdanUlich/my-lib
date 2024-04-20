import { useSession } from "next-auth/react";

export const useGetUser = () => {
  const { data: session } = useSession();
  const userId: string = session?.user?.id;

  return { userId };
};
