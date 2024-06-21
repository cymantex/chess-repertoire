// Repertoire
import { DrawShape } from "chessground/draw";
import { Move } from "chess.js";
import { DAISY_UI_THEMES, OpeningExplorerMove } from "@/defs.ts";

export const REPERTOIRE_ANNOTATION = {
  BRILLIANT: 100,
  GOOD: 200,
  INTERESTING: 300,
  NEUTRAL: 400,
  DUBIOUS: 500,
  BAD: 600,
  BLUNDER: 700,
} as const;
export type RepertoireMoveAnnotation =
  (typeof REPERTOIRE_ANNOTATION)[keyof typeof REPERTOIRE_ANNOTATION];

export interface AnnotatedMove extends Move {
  annotation?: RepertoireMoveAnnotation;
}

export interface RepertoireMove {
  san: string;
  annotation?: RepertoireMoveAnnotation;
}

export interface RepertoirePosition {
  moves: RepertoireMove[];
  comment?: string;
  shapes?: DrawShape[];
}

export type RepertoireOpeningExplorerMove =
  | AnnotatedMove
  | (AnnotatedMove & OpeningExplorerMove);

// Settings
export const ANNOTATION_SETTING_NONE = 1000;
export const ANNOTATION_SETTING_DONT_SAVE = 10000;
export const ANNOTATION_SETTINGS = {
  ...REPERTOIRE_ANNOTATION,
  NONE: ANNOTATION_SETTING_NONE,
  DONT_SAVE: ANNOTATION_SETTING_DONT_SAVE,
} as const;
export type AnnotationSetting =
  (typeof ANNOTATION_SETTINGS)[keyof typeof ANNOTATION_SETTINGS];

export type Theme = (typeof DAISY_UI_THEMES)[number];

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
  annotationSetting: AnnotationSetting;
  theme: Theme;
  engineSettings: EngineSettings;
  closedSections: Record<ToggleSection, ToggleState>;
}

export const SETTINGS_KEY = "repertoireSettings";
export const DEFAULT_SETTINGS: RepertoireSettings = {
  annotationSetting: REPERTOIRE_ANNOTATION.BRILLIANT,
  theme: "black",
  engineSettings: {
    searchTimeSeconds: Infinity,
    multiPv: 5,
    threads: 11,
  },
  closedSections: {
    [TOGGLE_SECTIONS.CHESS_ENGINE_ANALYSIS]: TOGGLE_STATE.ON,
    [TOGGLE_SECTIONS.CLOUD_ENGINE_EVALUATION]: TOGGLE_STATE.ON,
    [TOGGLE_SECTIONS.OPENING_EXPLORER]: TOGGLE_STATE.ON,
    [TOGGLE_SECTIONS.PGN_EXPLORER]: TOGGLE_STATE.OFF,
  },
};
export const DEFAULT_REPERTOIRE_POSITION = { moves: [] };
