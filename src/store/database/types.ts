export const REPERTOIRE_MOVE_PRIORITY = {
  KING: 4,
  QUEEN: 3,
  ROOK: 2,
  BISHOP: 1,
  PAWN: 0,
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
