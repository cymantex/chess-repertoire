import { useQuery } from "@tanstack/react-query";
import { CloudEvaluationResponse } from "@/defs.ts";
import axios, { AxiosError } from "axios";

export const useCloudEvaluationQuery = (fen: string) =>
  useQuery<CloudEvaluationResponse, AxiosError>({
    queryKey: [`cloud-evaluation-${fen}`],
    queryFn: () =>
      axios
        .get(`https://lichess.org/api/cloud-eval?fen=${fen}`)
        .then((res) => res.data),
    retry: false,
  });
