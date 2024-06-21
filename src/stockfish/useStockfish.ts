import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { useEffect, useState } from "react";
import {
  AnalysisResult,
  createStockfish,
} from "@/stockfish/createStockfish.ts";
import { toast } from "react-toastify";
import { isNumber, orderBy } from "lodash";
import { EngineSettings } from "@/repertoire/defs.ts";
import { parseFen } from "chessops/fen";
import { CG_WHITE } from "@/external/chessground/defs.tsx";

const stockfish = createStockfish();

export const useStockfish = ({
  multiPv,
  searchTimeSeconds,
  threads,
}: EngineSettings) => {
  const fen = useRepertoireStore(selectFen);
  const [analysing, setAnalysing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<
    Record<string, AnalysisResult>
  >({});

  const position = parseFen(fen).unwrap();

  useEffect(() => {
    const position = parseFen(fen).unwrap();

    const normalizeCp = (uciCp?: number) => {
      if (!isNumber(uciCp)) return undefined;
      return uciCp * (position.turn === CG_WHITE ? 1 : -1);
    };

    if (analysing) {
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
              [result.multipv]: {
                ...result,
                cp: normalizeCp(result.cp),
              },
            })),
          onError: (error) => toast.error(error.message),
          // TODO: Will clear results when the analysis is done (not wanted)
          onStop: () => setAnalysisResults({}),
        });
    }

    return () => {
      stockfish.stop();
    };
  }, [multiPv, threads, searchTimeSeconds, analysing, fen]);

  const analysisResultsOrderedByMateThenCp = orderBy(
    Object.values(analysisResults),
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

  const analysisResultsExists = Object.keys(analysisResults).length > 0;

  return {
    disabled: !analysing && analysisResultsExists,
    analysing: analysing || analysisResultsExists,
    analysisResults: analysisResultsOrderedByMateThenCp,
    toggleAnalysis: async () => {
      if (analysing) {
        stockfish.stop();
        setAnalysing(false);
        return;
      }

      await stockfish.start();
      setAnalysing(true);
    },
  };
};
