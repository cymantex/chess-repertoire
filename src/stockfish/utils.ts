import { isNumber } from "lodash";
import { AnalysisResult, BestMove } from "@/stockfish/defs.ts";

export const isAnalysisResult = (
  result: Partial<AnalysisResult>,
): result is AnalysisResult => {
  if (!result.pv) return false;
  if (result.pv.length > 1 && isNumber(result.cp)) return true;
  return isNumber(result.mate);
};

export const parsePartialAnalysisResult = (infoMessage: string) => {
  const analysisResult: Partial<AnalysisResult> = {};

  const parts = infoMessage.split(" ");
  analysisResult.cp = parseMessageInt("cp", parts);
  analysisResult.mate = parseMessageInt("mate", parts);
  analysisResult.depth = parseMessageInt("depth", parts);
  analysisResult.seldepth = parseMessageInt("seldepth", parts);
  analysisResult.tbhits = parseMessageInt("tbhits", parts);
  analysisResult.nodes = parseMessageInt("nodes", parts);
  analysisResult.time = parseMessageInt("time", parts);
  analysisResult.nps = parseMessageInt("nps", parts);
  analysisResult.multipv = parseMessageInt("multipv", parts);
  analysisResult.hashfull = parseMessageInt("hashfull", parts);

  const pvIndex = parts.indexOf("pv");

  if (pvIndex !== -1) {
    analysisResult.pv = parts.slice(pvIndex + 1);
  }

  return analysisResult;
};

export const parseBestMove = (bestmoveMessage: string): BestMove => ({
  bestmove: bestmoveMessage.split(" ")[1],
  ponder: bestmoveMessage.split(" ")[3],
});

const parseMessageInt = (
  key: string,
  messageParts: string[],
): number | undefined => {
  const index = messageParts.indexOf(key);

  if (index !== -1) {
    const messagePart = messageParts[index + 1];
    return parseInt(messagePart, 10);
  }

  return undefined;
};

export const generateUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
