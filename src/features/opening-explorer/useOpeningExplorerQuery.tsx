import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { OpeningExplorerResponse } from "@/features/opening-explorer/defs.ts";

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
