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

  const position = parseFen(fen).unwrap();

  useEffect(() => {
    const position = parseFen(fen).unwrap();

    const normalizeCp = (uciCp?: number) => {
      if (!isNumber(uciCp)) return undefined;
      return uciCp * (position.turn === CG_WHITE ? 1 : -1);
    };

    if (analysisState === ANALYSIS_STATE.ANALYSING && stockfish.isStarted()) {
      stockfish.analyze({
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
        onTimeout: () => {
          setAnalysisState(ANALYSIS_STATE.STOPPED);
        },
      });
    }

    return () => {
      stockfish.stop();
    };
  }, [multiPv, threads, searchTimeSeconds, analysisState, fen]);

  const analysisResultsOrderedByMateThenCp = orderBy(
    Object.values(analysisResults[fen] ?? {}),
    (result) => {
      if (isNumber(result.mate)) {
        return position.turn === CG_WHITE
          ? 1000 / result.mate
          : -1000 / result.mate;
      }

      return result.cp!;
    },
    position.turn === CG_WHITE ? "desc" : "asc",
  );

  return {
    analysing: analysisState,
    analysisResults: analysisResultsOrderedByMateThenCp,
    toggleAnalysis: async () => {
      if (analysisState === ANALYSIS_STATE.ANALYSING) {
        await stockfish.stop();
        setAnalysisState(ANALYSIS_STATE.STOPPED);
        return;
      }

      setAnalysisState(ANALYSIS_STATE.STARTING);
      await stockfish.start();

      stockfish.setThreads(threads).setMultipv(multiPv);

      setAnalysisState(ANALYSIS_STATE.ANALYSING);
    },
  };
};
