import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "react-oidc-context";

export const useLichessAccountQuery = () => {
  const { user } = useAuth();
  const accessToken = user?.access_token;

  return useQuery({
    queryKey: ["lichess-account", accessToken],
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<{ username?: unknown }>(
        "https://lichess.org/api/account",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal,
        },
      );

      if (typeof data?.username !== "string" || !data.username.trim()) {
        throw new Error("Lichess did not return a username.");
      }

      return data.username;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
