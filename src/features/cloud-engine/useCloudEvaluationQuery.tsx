import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CloudEvaluationResponse } from "@/features/cloud-engine/defs.ts";

export const useCloudEvaluationQuery = (fen: string) =>
  useQuery<CloudEvaluationResponse, AxiosError>({
    queryKey: [`cloud-evaluation-${fen}`],
    queryFn: () =>
      axios
        .get(`https://lichess.org/api/cloud-eval?fen=${fen}`)
        .then((res) => res.data),
    retry: false,
  });
