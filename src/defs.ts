import { INITIAL_FEN } from "chessops/fen";

export const FEN_STARTING_POSITION = INITIAL_FEN;

export const COLUMN_NUMBERS = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
} as const;

export const DAISY_UI_THEMES = [
  "black",
  "business",
  "coffee",
  "dark",
  "dim",
  "dracula",
  "forest",
  "light",
  "luxury",
  "night",
  "nord",
] as const;

export type Column = keyof typeof COLUMN_NUMBERS;

// Lichess API
export interface OpeningExplorerMove {
  averageRating: number;
  black: number;
  draws: number;
  san: string;
  white: number;
}

export interface OpeningExplorerResponse {
  black: number;
  draws: number;
  opening: string;
  white: number;
  moves: OpeningExplorerMove[];
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
  ANNOTATION_SETTINGS: "ANNOTATION_SETTINGS",
};
