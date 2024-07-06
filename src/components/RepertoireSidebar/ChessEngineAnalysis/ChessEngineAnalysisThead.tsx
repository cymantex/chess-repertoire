import {
  ANALYSIS_STATE,
  AnalysisResult,
  AnalysisState,
} from "@/stockfish/defs.ts";
import { useRepertoireSettings } from "@/stores/repertoireSettingsStore.ts";
import {
  toAnalysisResultEvaluation,
  toSearchTimeDisplayName,
} from "@/utils/utils.ts";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { FaSquareMinus, FaSquarePlus } from "react-icons/fa6";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";

interface ChessEngineAnalysisTheadProps {
  analysisState: AnalysisState;
  onChange: () => Promise<void>;
  result?: AnalysisResult;
  onAddLine: () => undefined | Promise<void>;
  onRemoveLine: () => undefined | Promise<void>;
  children: React.ReactNode;
}

export const ChessEngineAnalysisThead = ({
  analysisState,
  onChange,
  onAddLine,
  onRemoveLine,
  result,
  children,
}: ChessEngineAnalysisTheadProps) => {
  const { engineSettings } = useRepertoireSettings();
  const { multiPv, searchTimeSeconds, threads } = engineSettings;

  return (
    <td>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            id="analysis-toggle"
            type="checkbox"
            disabled={
              analysisState === ANALYSIS_STATE.STARTING ||
              analysisState === ANALYSIS_STATE.STOPPING
            }
            className="toggle toggle-sm"
            checked={analysisState === ANALYSIS_STATE.ANALYSING}
            onChange={onChange}
          />
          <span className="font-bold text-lg">
            <span className="font-bold">
              {toAnalysisResultEvaluation(result)}
            </span>
          </span>
        </div>
        <div className="font-light">
          <div className="flex gap-1">
            <p>Stockfish 16 NNUE</p>
            <p>Depth: {result?.depth ?? 0}</p>
          </div>
          <div className="flex gap-1">
            <p>Lines: {multiPv},</p>
            <p>Threads: {threads},</p>
            <p>Search Time: {toSearchTimeDisplayName(searchTimeSeconds)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto pr-4">
          <Tooltip tooltip="Add line">
            <IconButton
              className="text-lg transition-all hover:scale-150"
              disabled={multiPv === 10}
              onClick={onAddLine}
            >
              <FaSquarePlus />
            </IconButton>
          </Tooltip>
          <Tooltip className="whitespace-nowrap" tooltip="Remove line">
            <IconButton
              className="text-lg transition-all hover:scale-150"
              disabled={multiPv === 1}
              onClick={onRemoveLine}
            >
              <FaSquareMinus />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {children}
    </td>
  );
};
