import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { useRepertoireSettings } from "@/stores/localStorageStore.ts";
import {
  toAnalysisResultEvaluation,
  toSearchTimeDisplayName,
} from "@/utils/utils.ts";
import { useStockfish } from "@/stockfish/useStockfish.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { head } from "lodash";
import { Eval } from "@/components/reused/Eval.tsx";
import { TdWithOverflowCaret } from "@/components/reused/TdWithOverflowCaret.tsx";
import { AccordingTable } from "@/components/reused/AccordingTable.tsx";
import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { ANALYSIS_STATE } from "@/stockfish/defs.ts";

export const ChessEngineAnalysis = () => {
  const { engineSettings } = useRepertoireSettings();
  const { multiPv, searchTimeSeconds, threads } = engineSettings;
  const { analysisState, toggleAnalysis, analysisResults } =
    useStockfish(engineSettings);
  const firstResult = head(analysisResults);

  const fen = useRepertoireStore(selectFen);
  const chessopsPosition = parsePosition(fen);

  const missingColumns = analysisState ? multiPv - analysisResults.length : 0;

  // TODO +/- button for multiPv
  // TODO: Depth (in firstResult)
  return (
    <AccordingTable
      section={TOGGLE_SECTIONS.CHESS_ENGINE_ANALYSIS}
      renderTheadTrChildren={(toggleButton) => (
        <td>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled={
                  analysisState === ANALYSIS_STATE.STARTING ||
                  analysisState === ANALYSIS_STATE.STOPPING
                }
                className="toggle toggle-sm"
                checked={analysisState === ANALYSIS_STATE.ANALYSING}
                onChange={toggleAnalysis}
              />
              <span className="font-bold text-lg">
                <span className="font-bold">
                  {toAnalysisResultEvaluation(firstResult)}
                </span>
              </span>
            </div>
            <div className="font-light">
              <div className="flex gap-1">
                <p>Stockfish 16 NNUE</p>
              </div>
              <div className="flex gap-1">
                <p>Lines: {multiPv},</p>
                <p>Threads: {threads},</p>
                <p>Search Time: {toSearchTimeDisplayName(searchTimeSeconds)}</p>
              </div>
            </div>
            <div className="ml-auto pr-4">
              <button>+</button>
              <span>/</span>
              <button>-</button>
            </div>
          </div>
          {toggleButton}
        </td>
      )}
    >
      {analysisResults.map((result) => (
        <tr key={result.multipv}>
          <TdWithOverflowCaret>
            <Eval {...result} />{" "}
            {uciMovesToSan(chessopsPosition, result.pv.join(" "))}
          </TdWithOverflowCaret>
        </tr>
      ))}
      {new Array(missingColumns).fill("").map((_, index) => (
        <tr key={index}>
          <td className="invisible">Hidden</td>
        </tr>
      ))}
    </AccordingTable>
  );
};
