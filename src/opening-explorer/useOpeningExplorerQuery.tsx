import { useQuery } from "@tanstack/react-query";
import {
  CloudEvaluationResponse,
  OpeningExplorerResponse,
} from "@/opening-explorer/types.ts";

export const useOpeningExplorerQuery = (fen: string) => {
  const openingExplorerQuery = useQuery<OpeningExplorerResponse>({
    queryKey: [`opening-explorer-${fen}`],
    queryFn: () =>
      fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

  const cloudEvaluationQuery = useQuery<CloudEvaluationResponse>({
    queryKey: [`cloud-evaluation-${fen}`],
    queryFn: () =>
      fetch(`https://lichess.org/api/cloud-eval?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

  return {
    isPending: openingExplorerQuery.isPending || cloudEvaluationQuery.isPending,
    error: openingExplorerQuery.error || cloudEvaluationQuery.error,
    openingExplorerResponse: openingExplorerQuery.data!,
    cloudEvaluationResponse: cloudEvaluationQuery.data!,
  };
};
