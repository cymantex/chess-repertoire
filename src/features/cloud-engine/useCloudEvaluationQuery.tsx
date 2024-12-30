import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export interface CloudEvaluationResponse {
  fen: string;
  knodes: number;
  depth: number;
  pvs: {
    moves: string;
    cp: number;
  }[];
}

export const useCloudEvaluationQuery = (fen: string) =>
  useQuery<CloudEvaluationResponse, AxiosError>({
    queryKey: [`cloud-evaluation-${fen}`],
    queryFn: () =>
      axios
        .get(`https://lichess.org/api/cloud-eval?fen=${fen}`)
        .then((res) => res.data),
    retry: false,
  });
