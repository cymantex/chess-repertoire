import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Chess } from "chess.js";
import { defaultPgn } from "@/external/chessops/pgn.ts";
import { ChessRepertoireStore } from "@/store/zustand/defs.ts";
import { createRepertoireSlice } from "@/store/zustand/slices/repertoireSlice.ts";
import { createChessgroundSlice } from "@/store/zustand/slices/chessgroundSlice.ts";
import { createNavigationSlice } from "@/store/zustand/slices/navigationSlice.ts";
import { createOpeningExplorerSlice } from "@/store/zustand/slices/openingExplorerSlice.ts";

export const useRepertoireStore = create(
  devtools<ChessRepertoireStore>((set) => ({
    pgn: defaultPgn(),
    chess: new Chess(),
    ...createRepertoireSlice(set),
    ...createChessgroundSlice(set),
    ...createOpeningExplorerSlice(set),
    ...createNavigationSlice(set),
  })),
);
