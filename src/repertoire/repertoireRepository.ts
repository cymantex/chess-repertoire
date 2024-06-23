import { DrawShape } from "chessground/draw";
import { idbGet, idbUpsert } from "@/external/idb-keyval/adapter.ts";
import {
  ANNOTATION_SETTINGS,
  AnnotationSetting,
  DEFAULT_REPERTOIRE_POSITION,
  RepertoireMove,
  RepertoireMoveAnnotation,
  RepertoirePosition,
} from "@/repertoire/defs.ts";

export const getRepertoirePosition = async (fen: string) =>
  idbGet<RepertoirePosition>(fen);

export const deleteRepertoireMove = async (fen: string, san: string) =>
  idbUpsert<RepertoirePosition>(
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
        annotation: annotationSetting as RepertoireMoveAnnotation,
      };
    }

    if (annotationSetting === ANNOTATION_SETTINGS.NONE) {
      return move;
    }

    return {
      annotation: annotationSetting as RepertoireMoveAnnotation,
      ...move,
    };
  };

  return idbUpsert<RepertoirePosition>(
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
  idbUpsert<RepertoirePosition>(
    fen,
    { ...DEFAULT_REPERTOIRE_POSITION, shapes },
    (data) => ({
      ...data,
      shapes,
    }),
  );

export const setRepertoirePositionComment = async (
  fen: string,
  comment: string,
) =>
  idbUpsert<RepertoirePosition>(
    fen,
    { ...DEFAULT_REPERTOIRE_POSITION, comment },
    (data) => ({
      ...data,
      comment,
    }),
  );
