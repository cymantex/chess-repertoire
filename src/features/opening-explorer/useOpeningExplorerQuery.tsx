import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import type { OpeningExplorerResponse } from "@/features/opening-explorer/defs.ts";

export const useOpeningExplorerQuery = (fen: string) => {
  const { openingExplorerApi } = useRepertoireSettings();

  return useQuery<OpeningExplorerResponse, AxiosError>({
    queryKey: [`opening-explorer-${fen}`],
    queryFn: () =>
      axios
        .get(`https://explorer.lichess.ovh/${openingExplorerApi}?fen=${fen}`)
        .then((res) => res.data),
    retry: false,
  });
};
