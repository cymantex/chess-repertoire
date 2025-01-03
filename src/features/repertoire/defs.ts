import type { DrawShape } from "chessground/draw";
import type { Move } from "chess.js";
import type {
  BoardTheme,
  CgColor,
  PieceTheme,
} from "@/external/chessground/defs.tsx";
import {
  BOARD_THEMES,
  CG_WHITE,
  PIECE_THEMES,
} from "@/external/chessground/defs.tsx";
import type { Descendant } from "slate";
import type {
  AnnotationSetting,
  AnnotationTheme,
  MoveAnnotation,
} from "@/features/annotations/defs.ts";
import {
  ANNOTATION_THEMES,
  MOVE_ANNOTATIONS,
} from "@/features/annotations/defs.ts";
import type {
  OpeningExplorerApi,
  OpeningExplorerMove,
} from "@/features/opening-explorer/defs.ts";
import { OPENING_EXPLORER_API } from "@/features/opening-explorer/defs.ts";

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

export interface EngineSettings {
  searchTimeSeconds: number;
  multiPv: number;
  threads: number;
}

export interface RepertoireSettings {
  boardOrientation: CgColor;
  googleDriveEnabled: boolean;
  annotationSetting: AnnotationSetting;
  theme: DaisyUiTheme;
  pieceTheme: PieceTheme;
  boardTheme: BoardTheme;
  annotationTheme: AnnotationTheme;
  engineSettings: EngineSettings;
  sections: Record<ToggleSection, ToggleState>;
  openingExplorerApi: OpeningExplorerApi;
  selectedDatabase?: string;
}

export const SETTINGS_KEY = "repertoireSettings";
export const DEFAULT_SETTINGS: RepertoireSettings = {
  boardOrientation: CG_WHITE,
  googleDriveEnabled: false,
  annotationSetting: MOVE_ANNOTATIONS.BRILLIANT,
  theme: "black",
  pieceTheme: PIECE_THEMES.CARDINAL,
  boardTheme: BOARD_THEMES.BLUE2,
  annotationTheme: ANNOTATION_THEMES.DEFAULT,
  openingExplorerApi: OPENING_EXPLORER_API.MASTERS,
  engineSettings: {
    searchTimeSeconds: Infinity,
    multiPv: 5,
    threads: Math.ceil(navigator.hardwareConcurrency / 2),
  },
  sections: {
    [TOGGLE_SECTIONS.CHESS_ENGINE_ANALYSIS]: TOGGLE_STATE.OFF,
    [TOGGLE_SECTIONS.CLOUD_ENGINE_EVALUATION]: TOGGLE_STATE.OFF,
    [TOGGLE_SECTIONS.OPENING_EXPLORER]: TOGGLE_STATE.ON,
    [TOGGLE_SECTIONS.PGN_EXPLORER]: TOGGLE_STATE.OFF,
  },
};
export const DEFAULT_REPERTOIRE_POSITION = { moves: [] };
