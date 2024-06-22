import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import {
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
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
import { FaSquareMinus, FaSquarePlus } from "react-icons/fa6";
import { IconButton } from "@/components/reused/IconButton.tsx";

export const ChessEngineAnalysis = () => {
  const { engineSettings } = useRepertoireSettings();
  const { multiPv, searchTimeSeconds, threads } = engineSettings;
  const { analysisState, toggleAnalysis, analysisResults, changeMultiPv } =
    useStockfish(engineSettings);
  const firstResult = head(analysisResults);

  const fen = useRepertoireStore(selectFen);
  const chessopsPosition = parsePosition(fen);

  // Could either be that we have more multiPv than results or the other way around
  const multiPvDiff = analysisState ? multiPv - analysisResults.length : 0;

  const handleMultiPvChange = (multiPv: number) => {
    if (multiPv < 1 || multiPv > 10) return;
    localStorageStore.upsertEngineSettings({ multiPv });
    return changeMultiPv(multiPv);
  };

  const results =
    multiPvDiff < 0 ? analysisResults.slice(0, multiPv) : analysisResults;

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
                <p>Depth: {firstResult?.depth ?? 0}</p>
              </div>
              <div className="flex gap-1">
                <p>Lines: {multiPv},</p>
                <p>Threads: {threads},</p>
                <p>Search Time: {toSearchTimeDisplayName(searchTimeSeconds)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto pr-4">
              <IconButton
                title="Add line"
                className="text-lg transition-all hover:scale-150"
                disabled={multiPv === 10}
                onClick={() => handleMultiPvChange(multiPv + 1)}
              >
                <FaSquarePlus />
              </IconButton>
              <IconButton
                title="Remove line"
                className="text-lg transition-all hover:scale-150"
                disabled={multiPv === 1}
                onClick={() => handleMultiPvChange(multiPv - 1)}
              >
                <FaSquareMinus />
              </IconButton>
            </div>
          </div>
          {toggleButton}
        </td>
      )}
    >
      {results.map((result) => (
        <tr key={result.multipv}>
          <TdWithOverflowCaret>
            <Eval {...result} />{" "}
            {uciMovesToSan(chessopsPosition, result.pv.join(" "))}
          </TdWithOverflowCaret>
        </tr>
      ))}
      {multiPvDiff > 0 &&
        new Array(multiPvDiff).fill("").map((_, index) => (
          <tr key={index}>
            <td className="invisible">Hidden</td>
          </tr>
        ))}
    </AccordingTable>
  );
};
