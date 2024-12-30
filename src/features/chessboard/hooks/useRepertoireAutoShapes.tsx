import { Move } from "chess.js";
import { DrawShape } from "chessground/draw";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import { orderBy, uniqBy } from "lodash";
import { useNextAnnotatedMoves } from "@/features/chessboard/hooks/useNextAnnotatedMoves.ts";
import * as cg from "chessground/types";
import { useRestoreAutoShapesAfterSelection } from "@/features/chessboard/hooks/useRestoreAutoShapesAfterSelection.tsx";
import { getAnnotation } from "@/features/annotations/annotations.tsx";
import { safeSetAutoShapes } from "@/external/chessground/utils.ts";
import { AnnotatedMove } from "@/features/repertoire/defs.ts";
import { CG_ID } from "@/features/chessboard/utils.ts";
import { selectHoveredOpeningMove } from "@/features/opening-explorer/openingExplorerSlice.ts";

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
        CG_ID,
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
