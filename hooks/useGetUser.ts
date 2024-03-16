import { fetchService } from "@/services";
import { USER_API_ENDPOINT } from "@/types";
import { useQuery } from "react-query";

interface UseGetUserProps {
  email: string;
}

export const getUser = async (email: string) => {
  const urlWithQuery = `${USER_API_ENDPOINT}?email=${encodeURIComponent(
    email
  )}`;

  const user = await fetchService(urlWithQuery, { method: "GET" });
};

export const useGetUser = ({ email }: UseGetUserProps) => {
  const fetchUser = async () => {
    const urlWithQuery = `${USER_API_ENDPOINT}?email=${encodeURIComponent(
      email
    )}`;

    return fetchService(urlWithQuery, { method: "GET" });
  };

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(["user", email], fetchUser);

  return {
    user,
    isLoading,
    isError,
  };
};
