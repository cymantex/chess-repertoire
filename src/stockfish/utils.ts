import { isNumber } from "lodash";
import {
  AnalysisResult,
  BestMove,
  ErrorSubscriber,
  MessageSubscriber,
} from "@/stockfish/defs.ts";

export const waitUntilMessageReceived2 = (
  subscribeToMessage: (subscriber: MessageSubscriber) => unknown,
  unsubscribeToMessage: (subscriber: MessageSubscriber) => unknown,
  subscribeToError: (subscriber: ErrorSubscriber) => unknown,
  unsubscribeToError: (subscriber: ErrorSubscriber) => unknown,
  sendMessage: () => unknown,
  message: string,
) => {
  return new Promise<void>((resolve, reject) => {
    const waitUntilMessageReceived = (receivedMessage: string) => {
      if (message === receivedMessage) {
        unsubscribeToMessage(waitUntilMessageReceived);
        unsubscribeToError(rejectOnError);
        resolve();
      }
    };

    const rejectOnError = () => {
      unsubscribeToMessage(rejectOnError);
      unsubscribeToError(rejectOnError);
      reject();
    };

    subscribeToMessage(waitUntilMessageReceived);
    subscribeToError(rejectOnError);
    sendMessage();
  });
};

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
    const hashfull = messageParts[index + 1];
    return parseInt(hashfull, 10);
  }

  return undefined;
};
