import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Chess } from "chess.js";
import { ChessRepertoireStore } from "@/stores/zustand/defs.ts";
import { createRepertoireSlice } from "@/stores/zustand/slices/repertoireSlice.ts";
import { createChessgroundSlice } from "@/stores/zustand/slices/chessgroundSlice.ts";
import { createNavigationSlice } from "@/stores/zustand/slices/navigationSlice.ts";
import { createOpeningExplorerSlice } from "@/stores/zustand/slices/openingExplorerSlice.ts";
import { FEN_STARTING_POSITION, PGN_HEADERS, SIDEBARS } from "@/defs.ts";
import { defaultGame, parsePgn } from "chessops/pgn";
import {
  getNonReactiveState,
  handlePositionStateChange,
} from "@/stores/zustand/utils.ts";
import { selectChess } from "@/stores/zustand/selectors.ts";

const initHeaders = () => new Map([[PGN_HEADERS.FEN, FEN_STARTING_POSITION]]);

export const useRepertoireStore = create(
  devtools<ChessRepertoireStore>((set) => ({
    fen: FEN_STARTING_POSITION,
    chess: new Chess(),
    pgn: defaultGame(initHeaders),
    sidebar: SIDEBARS.OPENING_EXPLORER,

    openSidebar: (sidebar) => set({ sidebar }),
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
    ...createRepertoireSlice(set),
    ...createChessgroundSlice(set),
    ...createOpeningExplorerSlice(set),
    ...createNavigationSlice(set),
  })),
);
