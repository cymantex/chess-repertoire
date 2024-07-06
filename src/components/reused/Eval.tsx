import { toAnalysisResultEvaluation } from "@/utils/converters.ts";

interface EvalProps {
  cp?: number;
  mate?: number;
}

export const Eval = (evaluation: EvalProps) => (
  <span className="font-bold mr-1">
    {toAnalysisResultEvaluation(evaluation)}
  </span>
);
