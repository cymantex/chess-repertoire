export const REPERTOIRE_MOVE_PRIORITY = {
  KING: 0,
  QUEEN: 1,
  ROOK: 2,
  BISHOP: 3,
  PAWN: 4,
} as const;

export type RepertoireMovePriority =
  (typeof REPERTOIRE_MOVE_PRIORITY)[keyof typeof REPERTOIRE_MOVE_PRIORITY];

export interface RepertoireMove {
  san: string;
  priority?: RepertoireMovePriority;
}

export interface RepertoirePositionData {
  moves?: RepertoireMove[];
  comment?: string;
}
