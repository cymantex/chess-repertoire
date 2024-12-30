import type {
  AnalysisResult,
  AnalysisState} from "@/features/chess-engine/stockfish/defs.ts";
import {
  ANALYSIS_STATE
} from "@/features/chess-engine/stockfish/defs.ts";
import type { Position } from "chessops";
import { TdWithOverflowCaret } from "@/common/components/TdWithOverflowCaret.tsx";
import { Eval } from "@/common/components/Eval.tsx";
import { uciMovesToSan } from "@/external/chessops/utils.ts";
import { NextMoves } from "@/common/components/NextMoves.tsx";

interface Props {
  analysisState?: AnalysisState;
  result: AnalysisResult;
  position: Position;
  previousMoves: string[];
}

export const ChessEngineAnalysisTr = ({
  analysisState,
  position,
  previousMoves,
  result,
}: Props) => (
  <tr className="font-chess">
    <TdWithOverflowCaret flex>
      {analysisState === ANALYSIS_STATE.ANALYSING ? (
        <span className="pt-0.5 pb-0.5">
          <Eval {...result} />
          {uciMovesToSan(position, result.pv.join(" "))}
        </span>
      ) : (
        <>
          <Eval {...result} />
          <NextMoves
            variationOfNextMoves={uciMovesToSan(
              position,
              result.pv.join(" "),
            ).split(" ")}
            previousMoves={previousMoves}
          />
        </>
      )}
    </TdWithOverflowCaret>
  </tr>
);
