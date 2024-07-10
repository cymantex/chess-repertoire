// Repertoire
import { DrawShape } from "chessground/draw";
import { Move } from "chess.js";
import { OPENING_EXPLORER_API, OpeningExplorerMove } from "@/defs.ts";
import {
  BOARD_THEMES,
  BoardTheme,
  PIECE_THEMES,
  PieceTheme,
} from "@/external/chessground/defs.tsx";
import { Descendant } from "slate";
import {
  AnnotationSetting,
  MOVE_ANNOTATIONS,
  MoveAnnotation,
} from "@/annotations/defs.ts";

export interface AnnotatedMove extends Move {
  annotation?: MoveAnnotation;
}

export interface RepertoireMove {
  san: string;
  annotation?: MoveAnnotation;
}

export interface RepertoirePosition {
  moves: RepertoireMove[];
  comments?: Descendant[];
  shapes?: DrawShape[];
}

export type RepertoireOpeningExplorerMove =
  | AnnotatedMove
  | (AnnotatedMove & OpeningExplorerMove);

export const DAISY_UI_THEMES = ["black", "lofi"] as const;
export type DaisyUiTheme = (typeof DAISY_UI_THEMES)[number];

export const TOGGLE_SECTIONS = {
  CHESS_ENGINE_ANALYSIS: "CHESS_ENGINE_ANALYSIS",
  CLOUD_ENGINE_EVALUATION: "CLOUD_ENGINE_EVALUATION",
  OPENING_EXPLORER: "OPENING_EXPLORER",
  PGN_EXPLORER: "PGN_EXPLORER",
} as const;

export const TOGGLE_STATE = {
  ON: "on",
  OFF: "off",
} as const;

export type ToggleSection =
  (typeof TOGGLE_SECTIONS)[keyof typeof TOGGLE_SECTIONS];

export type ToggleState = (typeof TOGGLE_STATE)[keyof typeof TOGGLE_STATE];

export type OpeningExplorerApi =
  (typeof OPENING_EXPLORER_API)[keyof typeof OPENING_EXPLORER_API];

export interface EngineSettings {
  searchTimeSeconds: number;
  multiPv: number;
  threads: number;
}

export interface RepertoireSettings {
  googleDriveEnabled: boolean;
  annotationSetting: AnnotationSetting;
  theme: DaisyUiTheme;
  pieceTheme: PieceTheme;
  boardTheme: BoardTheme;
  engineSettings: EngineSettings;
  sections: Record<ToggleSection, ToggleState>;
  openingExplorerApi: OpeningExplorerApi;
  selectedDatabase?: string;
}

export const SETTINGS_KEY = "repertoireSettings";
export const DEFAULT_SETTINGS: RepertoireSettings = {
  googleDriveEnabled: false,
  annotationSetting: MOVE_ANNOTATIONS.BRILLIANT,
  theme: "black",
  pieceTheme: PIECE_THEMES.CARDINAL,
  boardTheme: BOARD_THEMES.BLUE2,
  openingExplorerApi: OPENING_EXPLORER_API.MASTERS,
  engineSettings: {
    searchTimeSeconds: Infinity,
    multiPv: 5,
    threads: navigator.hardwareConcurrency,
  },
  sections: {
    [TOGGLE_SECTIONS.CHESS_ENGINE_ANALYSIS]: TOGGLE_STATE.OFF,
    [TOGGLE_SECTIONS.CLOUD_ENGINE_EVALUATION]: TOGGLE_STATE.OFF,
    [TOGGLE_SECTIONS.OPENING_EXPLORER]: TOGGLE_STATE.ON,
    [TOGGLE_SECTIONS.PGN_EXPLORER]: TOGGLE_STATE.OFF,
  },
};
export const DEFAULT_REPERTOIRE_POSITION = { moves: [] };
