import { useQuery } from "@tanstack/react-query";
import { OpeningExplorerResponse } from "@/opening-explorer/types.ts";

export const useOpeningExplorerQuery = (fen: string) => {
  const openingExplorerQuery = useQuery<OpeningExplorerResponse>({
    queryKey: [`opening-explorer-${fen}`],
    queryFn: () =>
      fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

  return {
    isPending: openingExplorerQuery.isPending,
    error: openingExplorerQuery.error,
    openingExplorerResponse: openingExplorerQuery.data!,
  };
};
