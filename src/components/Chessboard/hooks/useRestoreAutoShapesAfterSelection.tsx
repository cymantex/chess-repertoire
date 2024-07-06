import { DrawShape } from "chessground/draw";
import { useEffect } from "react";
import {
  isChessgroundReady,
  safeSetAutoShapes,
  userSelectionExists,
} from "@/external/chessground/utils.ts";
import { CG_ID } from "@/components/Chessboard/utils.ts";

export const useRestoreAutoShapesAfterSelection = (shapes: DrawShape[]) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (isChessgroundReady(CG_ID) && !userSelectionExists(CG_ID)) {
        safeSetAutoShapes(CG_ID, shapes);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [shapes]);
};
