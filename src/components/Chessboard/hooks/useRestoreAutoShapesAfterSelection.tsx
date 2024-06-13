import { DrawShape } from "chessground/draw";
import { useEffect } from "react";
import {
  isChessgroundReady,
  safeSetAutoShapes,
  userSelectionExists,
} from "@/external/chessground/utils.ts";

export const useRestoreAutoShapesAfterSelection = (shapes: DrawShape[]) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (isChessgroundReady() && !userSelectionExists()) {
        safeSetAutoShapes(shapes);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [shapes]);
};
