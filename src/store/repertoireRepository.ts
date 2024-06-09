import {
  DEFAULT_REPERTOIRE_POSITION,
  PRIORITY_SETTING,
  PrioritySetting,
  RepertoireMove,
  RepertoireMovePriority,
  RepertoirePosition,
} from "@/defs.ts";
import { DrawShape } from "chessground/draw";
import { idbGet, idbUpsert } from "@/external/idb-keyval/adapter.ts";

export const getRepertoirePosition = async (fen: string) =>
  idbGet<RepertoirePosition>(fen);

export const deleteMove = async (fen: string, san: string) =>
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
  prioritySetting: PrioritySetting,
) => {
  if (prioritySetting === PRIORITY_SETTING.DONT_SAVE) {
    return Promise.resolve();
  }

  const withSelectedAutomaticPriority = (move: RepertoireMove) => {
    if (prioritySetting === PRIORITY_SETTING.NO_PRIORITY) {
      return move;
    }

    return {
      priority: prioritySetting as RepertoireMovePriority,
      ...move,
    };
  };

  return idbUpsert<RepertoirePosition>(
    fen,
    { moves: [withSelectedAutomaticPriority(repertoireMove)] },
    (data: RepertoirePosition) => {
      const { moves } = data;

      if (!moves) {
        return { ...data, moves: [repertoireMove] };
      }

      const existingMove = moves.find((m) => m.san === repertoireMove.san);

      if (existingMove) {
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
        moves: [...moves, withSelectedAutomaticPriority(repertoireMove)],
      };
    },
  );
};

export const setRepertoireShapes = async (fen: string, shapes: DrawShape[]) =>
  idbUpsert<RepertoirePosition>(
    fen,
    { ...DEFAULT_REPERTOIRE_POSITION, shapes },
    (data) => ({
      ...data,
      shapes,
    }),
  );

export const upsertRepertoireComment = async (fen: string, comment: string) =>
  idbUpsert<RepertoirePosition>(
    fen,
    { ...DEFAULT_REPERTOIRE_POSITION, comment },
    (data) => ({
      ...data,
      comment,
    }),
  );
