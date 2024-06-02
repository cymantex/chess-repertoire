import { getObject, upsertObject } from "local-storage-superjson";

interface RepertoireMove {
  san: string;
  priority?: number;
}

interface RepertoirePositionData {
  moves?: RepertoireMove[];
  comment?: string;
}

export const upsertRepertoireMove = (fen: string, move: RepertoireMove) =>
  upsertObject<RepertoirePositionData>(
    fen,
    { moves: [move] },
    (data: RepertoirePositionData) => {
      const { moves } = data;

      if (!moves) {
        return { ...data, moves: [move] };
      }

      const existingMove = moves.find((m) => m.san === move.san);

      // TODO: Sort by priority symbol + alphabetical
      if (existingMove) {
        return {
          ...data,
          moves: moves.map((m) => (m.san === move.san ? move : m)),
        };
      }

      return {
        ...data,
        moves: [...moves, move],
      };
    },
  );

export const upsertRepertoireComment = (fen: string, comment: string) =>
  upsertObject<RepertoirePositionData>(fen, { comment }, (data) => ({
    ...data,
    comment,
  }));

export const getRepertoireMoves = (fen: string) =>
  getRepertoireData(fen)?.moves ?? [];

export const getRepertoireComment = (fen: string) =>
  getRepertoireData(fen)?.comment ?? "";

const getRepertoireData = (fen: string) =>
  getObject<RepertoirePositionData>(fen);
