import type { RepertoireMove } from "@/features/repertoire/defs.ts";

import type { AnnotationSetting } from "@/features/annotations/defs.ts";

export interface PgnImportFile {
  file: File;
  playerNames: string[];
  playerName?: string;
}

export interface GameDownloadProgress {
  message: string;
  bytesReceived?: number;
}

export interface GameDownloadOptions {
  username: string;
  sinceTime?: number;
  maxGames?: number;
  signal: AbortSignal;
  onProgress: (progress: GameDownloadProgress) => void;
}

export interface ImportPgnOptions {
  annotationSetting: AnnotationSetting;
  playerSettings?: ImportPgnPlayerSettings;
  replaceAnnotations: boolean;
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
