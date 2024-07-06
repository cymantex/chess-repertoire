import { DrawShape } from "chessground/draw";
import { Api } from "chessground/api";

export const chessgroundMap: Map<string, Api> = new Map();

export const isChessgroundReady = (id: string) => chessgroundMap.has(id);

export const userSelectionExists = (id: string) =>
  chessgroundMap.get(id)?.state?.selected;

export const safeSetAutoShapes = (id: string, shapes: DrawShape[]) => {
  if (chessgroundMap.has(id)) {
    chessgroundMap.get(id)?.setAutoShapes?.(shapes);
  }
};
