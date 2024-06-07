import { Move } from "chess.js";
import { DrawShape } from "chessground/draw";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import { selectHoveredOpeningMove } from "@/store/selectors.ts";
import { orderBy, uniqBy } from "lodash";
import { useNextMovesWithPriority } from "@/components/Chessboard/hooks/useNextMovesWithPriority.tsx";
import { PRIORITY_SVG, PriorityMove } from "@/defs.ts";

export const useAutoShapes = () => {
  const hoveredOpeningMove = useRepertoireStore(selectHoveredOpeningMove);
  const squaresWithHighestPriority = uniqBy(
    orderBy(useNextMovesWithPriority(), (move) => move.priority),
    (move) => move.from,
  );

  const priorityShapes: DrawShape[] =
    squaresWithHighestPriority.map(createPriorityShape);

  return hoveredOpeningMove
    ? [createHoveredOpeningMoveShape(hoveredOpeningMove), ...priorityShapes]
    : priorityShapes;
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
