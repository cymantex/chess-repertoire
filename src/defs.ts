import { Move } from "chess.js";
import { DrawShape } from "chessground/draw";
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

// Repertoire
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

export interface RepertoirePgnPosition {
  move?: {
    san: string;
    annotation: string;
  };
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

export interface RepertoireSettings {
  annotationSetting: AnnotationSetting;
}
export const SETTINGS_KEY = "repertoireSettings";
export const DEFAULT_SETTINGS: RepertoireSettings = {
  annotationSetting: REPERTOIRE_ANNOTATION.BRILLIANT,
};

export const DEFAULT_REPERTOIRE_POSITION = { moves: [] };

export interface ImportPgnOptions {
  annotationSetting: AnnotationSetting;
  playerSettings?: ImportPgnPlayerSettings;
  includeComments: boolean;
  includeShapes: boolean;
  maxMoveNumber?: number;
  // TODO: Let user decide if annotations should be overridden
}

export interface ImportPgnGameOptions extends ImportPgnOptions {
  upsertMove: (
    fen: string,
    repertoireMove: RepertoireMove,
    annotationSetting: AnnotationSetting,
    overrideExistingAnnotation?: boolean,
  ) => Promise<void>;
  setShapes: (fen: string, shapes: DrawShape[]) => Promise<void>;
  setComment: (fen: string, comment: string) => Promise<void>;
}

export interface ImportPgnPlayerSettings {
  playerName: string;
  opponentAnnotationSetting: AnnotationSetting;
}

export interface ImportPgnProgress {
  totalGames?: number;
  gameCount?: number;
}

export interface ImportPgnCallbacks {
  onProgress: (progress: ImportPgnProgress) => void;
}
