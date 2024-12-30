import { toAnalysisResultEvaluation } from "@/common/utils/converters.ts";

interface Props {
  cp?: number;
  mate?: number;
}

export const Eval = (evaluation: Props) => (
  <span className="font-bold mr-1">
    {toAnalysisResultEvaluation(evaluation)}
  </span>
);
