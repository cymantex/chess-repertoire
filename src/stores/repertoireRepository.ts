import {
  ANNOTATION_SETTINGS,
  AnnotationSetting,
  DEFAULT_REPERTOIRE_POSITION,
  RepertoireMove,
  RepertoireMoveAnnotation,
  RepertoirePosition,
} from "@/defs.ts";
import { DrawShape } from "chessground/draw";
import { idbGet, idbUpsert } from "@/external/idb-keyval/adapter.ts";

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
) => {
  if (annotationSetting === ANNOTATION_SETTINGS.DONT_SAVE) {
    return Promise.resolve();
  }

  const withSelectedAutomaticAnnotation = (move: RepertoireMove) => {
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

      if (!moves) {
        return { ...data, moves: [repertoireMove] };
      }

      const moveExists = moves.some((m) => m.san === repertoireMove.san);

      if (moveExists) {
        return {
          ...data,
          moves: moves.map((move) =>
            move.san === repertoireMove.san
              ? {
                  ...move,
                  ...repertoireMove,
                }
              : move,
          ),
        };
      }

      return {
        ...data,
        moves: [...moves, withSelectedAutomaticAnnotation(repertoireMove)],
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
