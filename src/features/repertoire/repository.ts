import type { DrawShape } from "chessground/draw";
import type {
  RepertoireMove,
  RepertoirePosition,
} from "@/features/repertoire/defs.ts";
import { DEFAULT_REPERTOIRE_POSITION } from "@/features/repertoire/defs.ts";
import type { Descendant } from "slate";
import type {
  AnnotationSetting,
  MoveAnnotation,
} from "@/features/annotations/defs.ts";
import { ANNOTATION_SETTINGS } from "@/features/annotations/defs.ts";

import { positionsStore } from "@/features/repertoire/database/positionsStore.ts";

export const deleteRepertoireMove = async (fen: string, san: string) =>
  positionsStore.upsert(
    fen,
    DEFAULT_REPERTOIRE_POSITION,
    (data: RepertoirePosition) => ({
      ...data,
      moves: data.moves?.filter((move) => move.san !== san),
    }),
  );

export const upsertRepertoireMove = async (
  fen: string,
  repertoireMove: RepertoireMove,
  annotationSetting: AnnotationSetting,
  replaceExistingAnnotation = false,
) => {
  if (annotationSetting === ANNOTATION_SETTINGS.DONT_SAVE) {
    return Promise.resolve();
  }

  const withSelectedAutomaticAnnotation = (move: RepertoireMove) => {
    if (replaceExistingAnnotation) {
      return {
        ...move,
        annotation: annotationSetting as MoveAnnotation,
      };
    }

    if (annotationSetting === ANNOTATION_SETTINGS.NONE) {
      return move;
    }

    return {
      annotation: annotationSetting as MoveAnnotation,
      ...move,
    };
  };

  return positionsStore.upsert(
    fen,
    { moves: [withSelectedAutomaticAnnotation(repertoireMove)] },
    (data: RepertoirePosition) => {
      const { moves } = data;

      const annotatedMove = withSelectedAutomaticAnnotation(repertoireMove);

      if (!moves) {
        return { ...data, moves: [annotatedMove] };
      }

      const moveExists = moves.some((m) => m.san === repertoireMove.san);

      if (moveExists) {
        const moveUpdate = replaceExistingAnnotation
          ? annotatedMove
          : repertoireMove;
        return {
          ...data,
          moves: moves.map((move) =>
            move.san === moveUpdate.san
              ? {
                  ...move,
                  ...moveUpdate,
                }
              : move,
          ),
        };
      }

      return {
        ...data,
        moves: [...moves, annotatedMove],
      };
    },
  );
};

export const setRepertoirePositionShapes = async (
  fen: string,
  shapes: DrawShape[],
) =>
  positionsStore.upsert(
    fen,
    { ...DEFAULT_REPERTOIRE_POSITION, shapes },
    (data) => ({
      ...data,
      shapes,
    }),
  );

export const setRepertoirePositionComments = async (
  fen: string,
  comments: Descendant[],
) =>
  positionsStore.upsert(
    fen,
    { ...DEFAULT_REPERTOIRE_POSITION, comments },
    (data) => ({
      ...data,
      comments,
    }),
  );
