import { Chess, Move } from "chess.js";
import { Pgn } from "@/external/chessops/defs.ts";
import { CgColor } from "@/external/chessground/defs.tsx";
import { Key } from "chessground/types";
import { PieceSymbol } from "chess.js/src/chess.ts";
import { DrawShape } from "chessground/draw";
import {
  AnnotationSetting,
  RepertoireMove,
  RepertoireOpeningExplorerMove,
  RepertoirePosition,
} from "@/repertoire/defs.ts";

export interface NavigationSlice {
  goToFirstMove: () => Promise<void>;
  goToPreviousMove: () => Promise<void>;
  goToNextMove: () => Promise<void>;
  goToLastMove: () => Promise<void>;
}

export interface OpeningExplorerSlice {
  hoveredOpeningMove: Move | null;
  setHoveredOpeningMove: (
    openingMove: RepertoireOpeningExplorerMove | null,
  ) => void;
  handleOpeningExplorerMove: (
    openingMove: RepertoireOpeningExplorerMove,
  ) => void;
}

export interface ChessgroundSlice {
  orientation: CgColor;
  pendingPromotionMove: Move | null;
  rotate: () => void;
  handleChessgroundMove: (from: Key, to: Key) => Promise<void>;
  promote: (promotion: PieceSymbol) => Promise<void>;
}

export interface RepertoireSlice {
  currentRepertoirePosition: RepertoirePosition;
  getCurrentRepertoirePosition: () => Promise<void>;
  upsertMove: (
    fen: string,
    repertoireMove: RepertoireMove,
    annotationSetting: AnnotationSetting,
  ) => Promise<void>;
  deleteMove: (fen: string, san: string) => Promise<void>;
  setShapes: (shapes: DrawShape[]) => Promise<void>;
}

export interface ChessRepertoireStore
  extends RepertoireSlice,
    ChessgroundSlice,
    OpeningExplorerSlice,
    NavigationSlice {
  chess: Chess;
  pgn: Pgn;
}

export type SetState = (
  partial:
    | Partial<ChessRepertoireStore>
    | ((
        state: ChessRepertoireStore,
      ) => Partial<ChessRepertoireStore> | ChessRepertoireStore)
    | ChessRepertoireStore,
  replace?: boolean | undefined,
) => void;
