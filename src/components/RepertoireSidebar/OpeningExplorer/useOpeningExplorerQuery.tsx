import { useRepertoireSettings } from "@/stores/repertoireSettingsStore.ts";
import { useQuery } from "@tanstack/react-query";
import { OpeningExplorerResponse } from "@/defs.ts";

export const useOpeningExplorerQuery = (fen: string) => {
  const { openingExplorerApi } = useRepertoireSettings();

  return useQuery<OpeningExplorerResponse>({
    queryKey: [`opening-explorer-${fen}`],
    queryFn: () =>
      fetch(
        `https://explorer.lichess.ovh/${openingExplorerApi}?fen=${fen}`,
      ).then((res) => res.json()),
  });
};
