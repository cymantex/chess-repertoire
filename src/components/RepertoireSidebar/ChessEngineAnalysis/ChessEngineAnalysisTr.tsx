import {
  ANALYSIS_STATE,
  AnalysisResult,
  AnalysisState,
} from "@/stockfish/defs.ts";
import { Position } from "chessops";
import { TdWithOverflowCaret } from "@/components/reused/TdWithOverflowCaret.tsx";
import { Eval } from "@/components/reused/Eval.tsx";
import { uciMovesToSan } from "@/external/chessops/utils.ts";
import { NextMoves } from "@/components/reused/NextMoves.tsx";

interface ChessEngineAnalysisTrProps {
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
}: ChessEngineAnalysisTrProps) => (
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
