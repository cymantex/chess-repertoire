export interface OpeningExplorerMove {
  averageRating: number;
  black: number;
  draws: number;
  san: string;
  white: number;
}

export const OPENING_EXPLORER_API = {
  MASTERS: "masters",
  LICHESS: "lichess",
  NONE: "none",
} as const;

export interface TopGamesResponse {
  black: { name: string; rating: number };
  white: { name: string; rating: number };
  id: string;
  month: string;
  uci: string;
  winner: string;
  year: number;
}

export interface OpeningExplorerResponse {
  black: number;
  draws: number;
  opening: string;
  white: number;
  moves: OpeningExplorerMove[];
  topGames?: TopGamesResponse[];
}
