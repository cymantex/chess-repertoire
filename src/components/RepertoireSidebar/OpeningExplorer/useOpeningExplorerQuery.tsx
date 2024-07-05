import { useRepertoireSettings } from "@/stores/repertoireSettingsStore.ts";
import { useQuery } from "@tanstack/react-query";
import { OpeningExplorerResponse } from "@/defs.ts";
import axios, { AxiosError } from "axios";

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
