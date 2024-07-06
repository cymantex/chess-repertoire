import { INITIAL_FEN } from "chessops/fen";

export const ALLOWED_GLOBAL_SHORTCUT_TAG_TYPES = ["button", "body"];

export const FEN_STARTING_POSITION = INITIAL_FEN;

export const PGN_HEADERS = {
  FEN: "FEN",
  VARIANT: "Variant",
  STANDARD: "Standard",
} as const;

// Lichess API
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

export interface CloudEvaluationResponse {
  fen: string;
  knodes: number;
  depth: number;
  pvs: {
    moves: string;
    cp: number;
  }[];
}

export const SIDEBARS = {
  OPENING_EXPLORER: "OPENING_EXPLORER",
  SETTINGS: "SETTINGS",
} as const;

export type Sidebar = keyof typeof SIDEBARS;

// Layout
export const BREAKPOINT_MD = 768;
export const SIDEBAR_SIZE = 450;
export const MARGIN = 10; // Additional space to allow for scrollbars
export const APP_PADDING_REM = 0.75;

// Modal
export const MODAL_IDS = {
  CONFIRM: "confirm-modal",
  LOADING: "loading-modal",
  DATABASE: "database-modal",
  TOP_GAMES_MODAL: "top-games-modal",
  EDIT_PGN_MODAL: "edit-pgn-modal",
  ANNOTATION_SETTINGS: "annotation-settings-modal",
} as const;
