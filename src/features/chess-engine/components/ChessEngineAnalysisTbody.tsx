import { selectFen, useRepertoireStore } from "@/app/zustand/store.ts";
import { parsePosition } from "@/external/chessops/utils.ts";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { usePreviousMoves } from "@/common/hooks/usePreviousMoves.ts";
import { ChessEngineAnalysisTr } from "@/features/chess-engine/components/ChessEngineAnalysisTr.tsx";
import type {
  AnalysisResult,
  AnalysisState,
} from "@/features/chess-engine/stockfish/defs.ts";

interface Props {
  analysisState?: AnalysisState;
  analysisResults: AnalysisResult[];
}

export const ChessEngineAnalysisTbody = ({
  analysisResults,
  analysisState,
}: Props) => {
  const fen = useRepertoireStore(selectFen);
  const chessopsPosition = parsePosition(fen);

  const { engineSettings } = useRepertoireSettings();
  const { multiPv } = engineSettings;

  const previousMoves = usePreviousMoves();

  // Could either be that we have more multiPv than results or the other way around
  const multiPvDiff = analysisState ? multiPv - analysisResults.length : 0;

  const results =
    multiPvDiff < 0 ? analysisResults.slice(0, multiPv) : analysisResults;

  return (
    <>
      {results.map((result) => (
        <ChessEngineAnalysisTr
          key={result.multipv}
          analysisState={analysisState}
          result={result}
          position={chessopsPosition}
          previousMoves={previousMoves}
        />
      ))}
      {multiPvDiff > 0 &&
        new Array(multiPvDiff).fill("").map((_, index) => (
          <tr key={index}>
            <td className="invisible">
              <span className="pt-0.5 pb-0.5">Hidden</span>
            </td>
          </tr>
        ))}
    </>
  );
};
