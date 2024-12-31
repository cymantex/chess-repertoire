import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Chess } from "chess.js";
import type { RepertoireSlice } from "@/features/repertoire/repertoireSlice.ts";
import { createRepertoireSlice } from "@/features/repertoire/repertoireSlice.ts";
import type { ChessboardSlice } from "@/features/chessboard/chessboardSlice.ts";
import { createChessboardSlice } from "@/features/chessboard/chessboardSlice.ts";
import type { NavigationSlice } from "@/features/navigation/navigationSlice.ts";
import { createNavigationSlice } from "@/features/navigation/navigationSlice.ts";
import type { OpeningExplorerSlice } from "@/features/opening-explorer/openingExplorerSlice.ts";
import { createOpeningExplorerSlice } from "@/features/opening-explorer/openingExplorerSlice.ts";
import type { Game, PgnNodeData } from "chessops/pgn";
import { defaultGame, parsePgn } from "chessops/pgn";
import {
  getNonReactiveState,
  handlePositionStateChange,
} from "@/app/zustand/utils.ts";
import { PGN_HEADERS } from "@/features/pgn/defs.ts";

import { FEN_STARTING_POSITION } from "@/external/chessops/defs.ts";
import type { SidebarSlice } from "@/features/sidebar/sidebarSlice.ts";
import { createSidebarSlice } from "@/features/sidebar/sidebarSlice.ts";

const initHeaders = () => new Map([[PGN_HEADERS.FEN, FEN_STARTING_POSITION]]);

export interface ChessRepertoireStore
  extends RepertoireSlice,
    ChessboardSlice,
    OpeningExplorerSlice,
    NavigationSlice {
  fen: string;
  chess: Chess;

  pgn: Game<PgnNodeData>;
  savePgn: (pgn: string) => Promise<void>;

  sidebar: SidebarSlice;
}

export type SetState = (
  partial:
    | Partial<ChessRepertoireStore>
    | ((
        state: ChessRepertoireStore,
      ) => Partial<ChessRepertoireStore> | ChessRepertoireStore)
    | ChessRepertoireStore,
  replace?: false | undefined,
) => void;

export const useRepertoireStore = create(
  devtools<ChessRepertoireStore>((set) => ({
    fen: FEN_STARTING_POSITION,
    chess: new Chess(),
    pgn: defaultGame(initHeaders),

    savePgn: (pgn) => {
      const chess = selectChess(getNonReactiveState());
      const games = parsePgn(pgn, initHeaders);

      if (games.length > 0) {
        const game = games[0];

        if (game.headers.has(PGN_HEADERS.FEN)) {
          chess.load(game.headers.get(PGN_HEADERS.FEN)!);
        } else {
          chess.reset();
        }

        set({ pgn: games[0] });
        return handlePositionStateChange({ set });
      }

      return Promise.resolve();
    },
    sidebar: createSidebarSlice(set),
    ...createRepertoireSlice(set),
    ...createChessboardSlice(set),
    ...createOpeningExplorerSlice(set),
    ...createNavigationSlice(set),
  })),
);

export const selectChess = (state: ChessRepertoireStore) => state.chess;
export const selectFen = (state: ChessRepertoireStore) => state.fen;
export const selectPgn = (state: ChessRepertoireStore) => state.pgn;
export const selectSavePgn = (state: ChessRepertoireStore) => state.savePgn;
