import { DrawShape } from "chessground/draw";
import { useEffect } from "react";
import { chessground } from "@/external/chessground/Chessground.tsx";

export const useRestoreAutoShapesAfterSelection = (shapes: DrawShape[]) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (chessground && !chessground.state.selected) {
        chessground.setAutoShapes(shapes);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [shapes]);
};
