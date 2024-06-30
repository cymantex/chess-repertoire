import { Chess, Move } from "chess.js";
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
import { Sidebar } from "@/defs.ts";
import { Game, PgnNodeData } from "chessops/pgn";

export interface NavigationSlice {
  goToPosition: (movesFromStartingPosition: string[]) => Promise<void>;
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
  databases: string[];
  selectedDatabase?: string;
  selectDatabase: (dbDisplayName: string) => Promise<void>;
  createDatabase: (dbDisplayName: string) => Promise<void>;
  listDatabases: () => Promise<void>;
  fetchingRepertoirePosition: boolean;
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
  fen: string;
  chess: Chess;

  pgn: Game<PgnNodeData>;
  savePgn: (pgn: string) => Promise<void>;

  sidebar: Sidebar;
  openSidebar: (sidebar: Sidebar) => void;
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
