import { toAnalysisResultEvaluation } from "@/utils/utils.ts";

interface EvalProps {
  cp?: number;
  mate?: number;
}

export const Eval = (evaluation: EvalProps) => (
  <span className="font-bold mr-1">
    {toAnalysisResultEvaluation(evaluation)}
  </span>
);
