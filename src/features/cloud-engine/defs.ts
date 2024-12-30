export interface CloudEvaluationResponse {
  fen: string;
  knodes: number;
  depth: number;
  pvs: {
    moves: string;
    cp: number;
  }[];
}