import {
  DEFAULT_POSITION_DATA,
  PRIORITY_SETTING,
  PrioritySetting,
  RepertoireMove,
  RepertoireMovePriority,
  RepertoirePositionData,
} from "@/defs.ts";
import { upsertIdbObject } from "@/store/database/idpUtils.ts";
import { get } from "idb-keyval";

export const getPositionData = async (fen: string) =>
  get<RepertoirePositionData>(fen);

export const deleteMove = async (fen: string, san: string) =>
  upsertIdbObject<RepertoirePositionData>(
    fen,
    DEFAULT_POSITION_DATA,
    (data: RepertoirePositionData) => ({
      ...data,
      moves: data.moves?.filter((move) => move.san !== san),
    }),
  );

// TODO: Take PrioritySettings as an argument instead
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

  return upsertIdbObject<RepertoirePositionData>(
    fen,
    { moves: [withSelectedAutomaticPriority(repertoireMove)] },
    (data: RepertoirePositionData) => {
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

export const upsertRepertoireComment = async (fen: string, comment: string) =>
  upsertIdbObject<RepertoirePositionData>(
    fen,
    { ...DEFAULT_POSITION_DATA, comment },
    (data) => ({
      ...data,
      comment,
    }),
  );
