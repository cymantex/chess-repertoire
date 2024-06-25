import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Chess } from "chess.js";
import { defaultPgn } from "@/external/chessops/pgn.ts";
import { ChessRepertoireStore } from "@/stores/zustand/defs.ts";
import { createRepertoireSlice } from "@/stores/zustand/slices/repertoireSlice.ts";
import { createChessgroundSlice } from "@/stores/zustand/slices/chessgroundSlice.ts";
import { createNavigationSlice } from "@/stores/zustand/slices/navigationSlice.ts";
import { createOpeningExplorerSlice } from "@/stores/zustand/slices/openingExplorerSlice.ts";
import { SIDEBARS } from "@/defs.ts";

export const useRepertoireStore = create(
  devtools<ChessRepertoireStore>((set) => ({
    pgn: defaultPgn(),
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
