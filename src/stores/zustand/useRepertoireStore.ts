import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Chess } from "chess.js";
import { ChessRepertoireStore } from "@/stores/zustand/defs.ts";
import { createRepertoireSlice } from "@/stores/zustand/slices/repertoireSlice.ts";
import { createChessgroundSlice } from "@/stores/zustand/slices/chessgroundSlice.ts";
import { createNavigationSlice } from "@/stores/zustand/slices/navigationSlice.ts";
import { createOpeningExplorerSlice } from "@/stores/zustand/slices/openingExplorerSlice.ts";
import { FEN_STARTING_POSITION, SIDEBARS } from "@/defs.ts";
import { defaultGame } from "chessops/pgn";

export const useRepertoireStore = create(
  devtools<ChessRepertoireStore>((set) => ({
    fen: FEN_STARTING_POSITION,
    pgn: defaultGame(),
    chess: new Chess(),
    sidebar: SIDEBARS.OPENING_EXPLORER,
    openSidebar: (sidebar) => set({ sidebar }),
    ...createRepertoireSlice(set),
    ...createChessgroundSlice(set),
    ...createOpeningExplorerSlice(set),
    ...createNavigationSlice(set),
  })),
);

useRepertoireStore.getState().getCurrentRepertoirePosition();
useRepertoireStore.getState().listDatabases();
