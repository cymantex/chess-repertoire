import { chessground } from "@/external/chessground/Chessground.tsx";
import { DrawShape } from "chessground/draw";

export const isChessgroundReady = () => !!chessground;
export const userSelectionExists = () => chessground?.state?.selected;
export const safeSetAutoShapes = (shapes: DrawShape[]) => {
  if (chessground) {
    chessground.setAutoShapes(shapes);
  }
};
