import { DrawBrushes } from "chessground/draw";

export const CG_WHITE = "white";
export const CG_BLACK = "black";
export type CgColor = "white" | "black";

export const DEFAULT_BRUSHES: DrawBrushes = {
  green: { key: "g", color: "#15781B", opacity: 1, lineWidth: 10 },
  red: { key: "r", color: "#882020", opacity: 1, lineWidth: 10 },
  blue: { key: "b", color: "#003088", opacity: 1, lineWidth: 10 },
  yellow: { key: "y", color: "#e68f00", opacity: 1, lineWidth: 10 },
  paleBlue: {
    key: "pb",
    color: "#003088",
    opacity: 0.4,
    lineWidth: 15,
  },
  paleGreen: {
    key: "pg",
    color: "#15781B",
    opacity: 0.4,
    lineWidth: 15,
  },
  paleRed: { key: "pr", color: "#882020", opacity: 0.4, lineWidth: 15 },
  paleGrey: {
    key: "pgr",
    color: "#4a4a4a",
    opacity: 0.35,
    lineWidth: 15,
  },
  purple: {
    key: "purple",
    color: "#68217a",
    opacity: 0.65,
    lineWidth: 10,
  },
  pink: { key: "pink", color: "#ee2080", opacity: 0.5, lineWidth: 10 },
  white: { key: "white", color: "white", opacity: 1, lineWidth: 10 },
};

export const PIECE_THEMES = {
  CARDINAL: "cardinal",
  CBURNETT: "cburnett",
} as const;

export type PieceTheme = (typeof PIECE_THEMES)[keyof typeof PIECE_THEMES];

export const BOARD_THEMES = {
  BLUE2: "blue2",
  BROWN: "brown",
} as const;

export type BoardTheme = (typeof BOARD_THEMES)[keyof typeof BOARD_THEMES];
