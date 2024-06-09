import { Move } from "chess.js";
import { DrawShape } from "chessground/draw";
import { useRepertoireStore } from "@/store/zustand/useRepertoireStore.ts";
import { selectHoveredOpeningMove } from "@/store/zustand/selectors.ts";
import { orderBy, uniqBy } from "lodash";
import { useNextMovesWithPriority } from "@/hooks/useNextMovesWithPriority.ts";
import { PRIORITY_SVG, PriorityMove } from "@/defs.ts";
import * as cg from "chessground/types";
import { chessground } from "@/external/chessground/Chessground.tsx";
import { useRestoreAutoShapesAfterSelection } from "@/components/Chessboard/hooks/useRestoreAutoShapesAfterSelection.tsx";

export const useRepertoireAutoShapes = () => {
  const nextMoves = useNextMovesWithPriority();
  const hoveredOpeningMove = useRepertoireStore(selectHoveredOpeningMove);
  const squaresWithHighestPriority = uniqBy(
    orderBy(useNextMovesWithPriority(), (move) => move.priority),
    (move) => move.from,
  );

  const priorityShapes: DrawShape[] =
    squaresWithHighestPriority.map(createPriorityShape);

  const repertoireAutoShapes = hoveredOpeningMove
    ? [createHoveredOpeningMoveShape(hoveredOpeningMove), ...priorityShapes]
    : priorityShapes;

  useRestoreAutoShapesAfterSelection(repertoireAutoShapes);

  return {
    repertoireAutoShapes,
    setPriorityShapeForSelection: (square: cg.Key) => {
      if (!chessground) return;

      chessground.setAutoShapes(
        nextMoves
          .filter((move) => move.from === square)
          .map(createPriorityShapeForSelectedMove),
      );
    },
  };
};

export const createPriorityShapeForSelectedMove = (
  move: PriorityMove,
): DrawShape => ({
  orig: move.from,
  dest: move.to,
  customSvg: {
    html: PRIORITY_SVG[move.priority!],
    center: "dest",
  },
});

const createPriorityShape = (move: PriorityMove): DrawShape => ({
  orig: move.from,
  customSvg: {
    html: PRIORITY_SVG[move.priority!],
    center: "orig",
  },
});

const createHoveredOpeningMoveShape = (hoveredOpeningMove: Move) => ({
  orig: hoveredOpeningMove?.from,
  dest: hoveredOpeningMove?.to,
  brush: "blue",
});
