import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { useEffect, useState } from "react";
import { createStockfish } from "@/stockfish/createStockfish.ts";
import { toast } from "react-toastify";
import { isNumber, orderBy } from "lodash";
import { EngineSettings } from "@/repertoire/defs.ts";
import { parseFen } from "chessops/fen";
import { CG_WHITE } from "@/external/chessground/defs.tsx";
import {
  ANALYSIS_STATE,
  AnalysisResult,
  AnalysisState,
  STOCKFISH_OPTIONS,
} from "@/stockfish/defs.ts";

const stockfish = createStockfish();

export const useStockfish = ({
  multiPv,
  searchTimeSeconds,
  threads,
}: EngineSettings) => {
  const fen = useRepertoireStore(selectFen);
  const [analysisState, setAnalysisState] = useState<AnalysisState>(
    ANALYSIS_STATE.STOPPED,
  );
  const [analysisResults, setAnalysisResults] = useState<
    Record<string, Record<string, AnalysisResult>>
  >({});

  const whiteToMove = parseFen(fen).unwrap().turn === CG_WHITE;

  useEffect(() => {
    // UCI CP values are based on the side to move. For example if black is to
    // move a positive value means that black is better and a negative value
    // means that white is better.
    const normalizeCp = (uciCp?: number) => {
      if (!isNumber(uciCp)) return undefined;
      return uciCp * (whiteToMove ? 1 : -1);
    };

    if (analysisState === ANALYSIS_STATE.ANALYSING && stockfish.isStarted()) {
      stockfish.analyse({
        fen,
        searchTimeInMs:
          searchTimeSeconds === Infinity ? Infinity : searchTimeSeconds * 1000,
        onAnalysisResult: (result) =>
          setAnalysisResults((prev) => ({
            ...prev,
            [fen]: {
              ...prev[fen],
              [result.multipv]: {
                ...result,
                cp: normalizeCp(result.cp),
              },
            },
          })),
        onError: (error) => {
          setAnalysisState(ANALYSIS_STATE.STOPPED);
          toast.error(error.message);
        },
        onTimeout: () => setAnalysisState(ANALYSIS_STATE.STOPPED),
      });
    }

    return () => {
      stockfish.stop();
    };
  }, [whiteToMove, multiPv, threads, searchTimeSeconds, analysisState, fen]);

  const analysisResultsOrderedByMateThenCp = orderBy(
    Object.values(analysisResults[fen] ?? {}),
    (result) => {
      if (isNumber(result.mate)) {
        return whiteToMove ? 1000 / result.mate : -1000 / result.mate;
      }

      return result.cp!;
    },
    whiteToMove ? "desc" : "asc",
  );

  return {
    analysisState,
    analysisResults: analysisResultsOrderedByMateThenCp,
    toggleAnalysis: async () => {
      if (analysisState === ANALYSIS_STATE.ANALYSING) {
        setAnalysisState(ANALYSIS_STATE.STOPPING);
        await stockfish.stop();
        setAnalysisState(ANALYSIS_STATE.STOPPED);
        return;
      }

      setAnalysisState(ANALYSIS_STATE.STARTING);
      await stockfish.start();

      stockfish
        .setOption(STOCKFISH_OPTIONS.threads, threads)
        .setOption(STOCKFISH_OPTIONS.multiPv, multiPv);

      setAnalysisState(ANALYSIS_STATE.ANALYSING);
    },
    changeMultiPv: async (multiPv: number) => {
      setAnalysisState(ANALYSIS_STATE.STOPPING);
      await stockfish.stop();
      await stockfish.start();
      stockfish.setOption(STOCKFISH_OPTIONS.multiPv, multiPv);
      setAnalysisState(ANALYSIS_STATE.ANALYSING);
    },
  };
};
