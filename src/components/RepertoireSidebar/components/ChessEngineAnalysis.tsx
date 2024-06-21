import {
  AnalysisResult,
  createStockfish,
} from "@/stockfish/createStockfish.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectChess, selectFen } from "@/stores/zustand/selectors.ts";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { head, orderBy } from "lodash";
import { determineTurnColor } from "@/components/Chessboard/utils.ts";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";
import { useRepertoireSettings } from "@/stores/localStorageStore.ts";
import { searchTimeDisplayName } from "@/utils/utils.ts";

const stockfish = createStockfish();

export const ChessEngineAnalysis = () => {
  const { engineSettings } = useRepertoireSettings();
  const { multiPv, searchTimeSeconds, threads } = engineSettings;

  const chess = useRepertoireStore(selectChess);
  const fen = useRepertoireStore(selectFen);
  const [analysing, setAnalysing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<
    Record<string, AnalysisResult>
  >({});
  const chessopsPosition = parsePosition(fen);

  const turnColor = determineTurnColor(chess);

  // TODO: Based on who is to move
  const cpDisplayValue = (uciCp: number) => {
    const cp = uciCp * (turnColor === "white" ? 1 : -1);

    return (
      <span className="font-bold">
        {cp < 0 ? `${(cp / 100).toFixed(2)}` : `+${(cp / 100).toFixed(2)}`}
      </span>
    );
  };

  useEffect(() => {
    if (analysing) {
      // TODO: Configurable
      stockfish
        .stop()
        .setThreads(threads)
        .setMultipv(multiPv)
        .analyze({
          fen,
          searchTimeInMs:
            searchTimeSeconds === Infinity
              ? Infinity
              : searchTimeSeconds * 1000,
          onAnalysisResult: (result) =>
            setAnalysisResults((prev) => ({
              ...prev,
              [result.multipv]: result,
            })),
          onError: (error) => toast.error(error.message),
          onStop: () => setAnalysisResults({}),
        });
    }

    return () => {
      stockfish.stop();
    };
  }, [analysing, fen]);

  const analysisResultsOrderedByCp = orderBy(
    Object.values(analysisResults),
    (result) => result.cp,
    "desc",
  );

  const firstCp = head(analysisResultsOrderedByCp)?.cp ?? 0;

  // TODO: Dropdown for variations
  return (
    <HideOnMobile>
      <table className="table table-xs overflow-auto">
        <thead>
          <tr>
            <td className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="toggle toggle-sm"
                    checked={analysing}
                    onChange={async () => {
                      if (analysing) {
                        stockfish.stop();
                        setAnalysing(false);
                        return;
                      }

                      await stockfish.start();
                      setAnalysing(true);
                    }}
                  />
                  <span className="font-bold text-lg">
                    {cpDisplayValue(firstCp)}
                  </span>
                </div>
                <div className="font-light">
                  <div className="flex gap-1">
                    <p>Stockfish 16 NNUE</p>
                  </div>
                  <div className="flex gap-1">
                    <p>Lines: {multiPv},</p>
                    <p>Threads: {threads},</p>
                    <p>
                      Search Time: {searchTimeDisplayName(searchTimeSeconds)}
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          {
            // TODO: Order by CP
            analysisResultsOrderedByCp.map((result) => (
              <tr key={result.multipv}>
                <td className="whitespace-nowrap">
                  {cpDisplayValue(result.cp!)}{" "}
                  {uciMovesToSan(chessopsPosition, result.pv.join(" "))}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </HideOnMobile>
  );
};
