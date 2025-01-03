import { selectFen, useRepertoireStore } from "@/app/zustand/store.ts";
import { useEffect, useState } from "react";
import { createStockfish } from "@/features/chess-engine/stockfish/createStockfish.ts";
import { isNumber, orderBy } from "lodash";
import type { EngineSettings } from "@/features/repertoire/defs.ts";
import { parseFen } from "chessops/fen";
import { CG_WHITE } from "@/external/chessground/defs.tsx";
import type {
  AnalysisResult,
  AnalysisState} from "@/features/chess-engine/stockfish/defs.ts";
import {
  ANALYSIS_STATE,
  STOCKFISH_OPTIONS,
} from "@/features/chess-engine/stockfish/defs.ts";
import { openDefaultErrorToast } from "@/external/react-toastify/toasts.ts";
import { selectPendingPromotionMove } from "@/features/chessboard/chessboardSlice.ts";

const stockfish = createStockfish();

const NUMBER_LARGER_THAN_HIGHEST_EVAL = 1000_000;

export const useStockfish = ({
  multiPv,
  searchTimeSeconds,
  threads,
}: EngineSettings) => {
  const fen = useRepertoireStore(selectFen);
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);
  const [analysisState, setAnalysisState] = useState<AnalysisState>(
    ANALYSIS_STATE.STOPPED,
  );
  const [analysisResults, setAnalysisResults] = useState<
    Record<string, Record<string, AnalysisResult>>
  >({});

  const whiteToMove = parseFen(fen).unwrap().turn === CG_WHITE;

  const handleError = (error: unknown) => {
    setAnalysisState(ANALYSIS_STATE.STOPPED);
    throw error;
  };

  useEffect(() => {
    // UCI CP values are based on the side to move. For example if black is to
    // move a positive value means that black is better and a negative value
    // means that white is better.
    const normalizeCp = (uciCp?: number) => {
      if (!isNumber(uciCp)) return undefined;
      return uciCp * (whiteToMove ? 1 : -1);
    };

    if (analysisState === ANALYSIS_STATE.ANALYSING && stockfish.isStarted()) {
      stockfish
        .analyse({
          fen,
          searchTimeInMs:
            searchTimeSeconds === Infinity
              ? Infinity
              : searchTimeSeconds * 1000,
          onAnalysisResult: (result, resultFen) => {
            if (resultFen !== fen) return;
            setAnalysisResults((prev) => ({
              ...prev,
              [fen]: {
                ...prev[fen],
                [result.multipv]: {
                  ...result,
                  cp: normalizeCp(result.cp),
                },
              },
            }));
          },
          onError: (error) => {
            setAnalysisState(ANALYSIS_STATE.STOPPED);
            openDefaultErrorToast(error);
          },
          onTimeout: () => setAnalysisState(ANALYSIS_STATE.STOPPED),
        })
        .catch(() => setAnalysisState(ANALYSIS_STATE.STOPPED));
    }

    return () => {
      stockfish.stop();
    };
  }, [whiteToMove, multiPv, threads, searchTimeSeconds, analysisState, fen]);

  const analysisResultsOrderedByMateThenCp = orderBy(
    Object.values(analysisResults[fen] ?? {}),
    (result) => {
      if (isNumber(result.mate)) {
        return whiteToMove
          ? NUMBER_LARGER_THAN_HIGHEST_EVAL / result.mate
          : -NUMBER_LARGER_THAN_HIGHEST_EVAL / result.mate;
      }

      return result.cp!;
    },
    whiteToMove ? "desc" : "asc",
  );

  return {
    analysisState,
    analysisResults: pendingPromotionMove
      ? []
      : analysisResultsOrderedByMateThenCp,
    toggleAnalysis: async () => {
      if (analysisState === ANALYSIS_STATE.ANALYSING) {
        stockfish.stop();
        setAnalysisState(ANALYSIS_STATE.STOPPED);
        return;
      }

      setAnalysisState(ANALYSIS_STATE.STARTING);
      await stockfish.start().catch(handleError);

      stockfish
        .setOption(STOCKFISH_OPTIONS.threads, threads)
        .setOption(STOCKFISH_OPTIONS.multiPv, multiPv);

      setAnalysisState(ANALYSIS_STATE.ANALYSING);
    },
    changeMultiPv: async (multiPv: number) => {
      if (analysisState === ANALYSIS_STATE.ANALYSING) {
        stockfish.stop();
        await stockfish.start().catch(handleError);
        stockfish.setOption(STOCKFISH_OPTIONS.multiPv, multiPv);
        setAnalysisState(ANALYSIS_STATE.ANALYSING);
      } else {
        stockfish.setOption(STOCKFISH_OPTIONS.multiPv, multiPv);
      }
    },
  };
};
