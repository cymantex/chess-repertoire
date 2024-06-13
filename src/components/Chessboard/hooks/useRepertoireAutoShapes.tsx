import { Move } from "chess.js";
import { DrawShape } from "chessground/draw";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectHoveredOpeningMove } from "@/stores/zustand/selectors.ts";
import { orderBy, uniqBy } from "lodash";
import { useNextAnnotatedMoves } from "@/hooks/useNextAnnotatedMoves.ts";
import { AnnotatedMove } from "@/defs.ts";
import * as cg from "chessground/types";
import { useRestoreAutoShapesAfterSelection } from "@/components/Chessboard/hooks/useRestoreAutoShapesAfterSelection.tsx";
import { getAnnotation } from "@/assets/annotation/defs.ts";
import { safeSetAutoShapes } from "@/external/chessground/utils.ts";

export const useRepertoireAutoShapes = () => {
  const nextMoves = useNextAnnotatedMoves();
  const hoveredOpeningMove = useRepertoireStore(selectHoveredOpeningMove);
  const squaresWithBestAnnotation = uniqBy(
    orderBy(nextMoves, (move) => move.annotation),
    (move) => move.from,
  );

  const annotationShapes: DrawShape[] = squaresWithBestAnnotation.map(
    createAnnotationShape,
  );

  const repertoireAutoShapes = hoveredOpeningMove
    ? [createHoveredOpeningMoveShape(hoveredOpeningMove), ...annotationShapes]
    : annotationShapes;

  useRestoreAutoShapesAfterSelection(repertoireAutoShapes);

  return {
    repertoireAutoShapes,
    setAnnotationShapeForSelection: (square: cg.Key) =>
      safeSetAutoShapes(
        nextMoves
          .filter((move) => move.from === square)
          .map(createAnnotationShapeForSelectedMove),
      ),
  };
};

export const createAnnotationShapeForSelectedMove = (
  move: AnnotatedMove,
): DrawShape => ({
  orig: move.from,
  dest: move.to,
  customSvg: {
    html: getAnnotation(move.annotation)?.svg,
    center: "dest",
  },
});

const createAnnotationShape = (move: AnnotatedMove): DrawShape => ({
  orig: move.from,
  customSvg: {
    html: getAnnotation(move.annotation)?.svg,
    center: "orig",
  },
});

const createHoveredOpeningMoveShape = (hoveredOpeningMove: Move) => ({
  orig: hoveredOpeningMove?.from,
  dest: hoveredOpeningMove?.to,
  brush: "paleBlue",
});
