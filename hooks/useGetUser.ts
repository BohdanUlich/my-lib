import { useSession } from "next-auth/react";

export const useGetUser = () => {
  const { data: session } = useSession();
  const userId: string = session?.user?.id;
  const userName: string = session?.user?.name;
  const userImage: string | undefined = session?.user?.image;
  const userEmail: string = session?.user?.email;
  return { userId, userName, userImage, userEmail };
};
