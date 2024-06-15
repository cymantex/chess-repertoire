import { AnnotationSetting, RepertoireMove } from "@/defs.ts";

export interface ImportPgnOptions {
  annotationSetting: AnnotationSetting;
  playerSettings?: ImportPgnPlayerSettings;
  includeComments: boolean;
  maxMoveNumber?: number;
}

export interface ImportPgnGameOptions extends ImportPgnOptions {
  upsertMove: (
    fen: string,
    repertoireMove: RepertoireMove,
    annotationSetting: AnnotationSetting,
    overrideExistingAnnotation?: boolean,
  ) => Promise<void>;
  setComment: (fen: string, comment: string) => Promise<void>;
}

export interface ImportPgnPlayerSettings {
  playerName: string;
  opponentAnnotationSetting: AnnotationSetting;
}

export interface ImportPgnProgress {
  totalGames: number;
  gameCount: number;
}

export interface ImportPgnCallbacks {
  onProgress: (progress: ImportPgnProgress) => void;
}
