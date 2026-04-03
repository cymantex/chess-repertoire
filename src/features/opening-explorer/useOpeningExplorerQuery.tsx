import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import type { OpeningExplorerResponse } from "@/features/opening-explorer/defs.ts";
import { useAuth } from "react-oidc-context";

export const useOpeningExplorerQuery = (fen: string) => {
  const auth = useAuth();

  const { openingExplorerApi } = useRepertoireSettings();

  return useQuery<OpeningExplorerResponse, AxiosError>({
    queryKey: [`opening-explorer-${fen}`],
    queryFn: () =>
      axios
        .get(`https://explorer.lichess.ovh/${openingExplorerApi}?fen=${fen}`, {
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
          },
        })
        .then((res) => res.data),
    enabled: !!auth.user?.access_token,
    retry: false,
  });
};
