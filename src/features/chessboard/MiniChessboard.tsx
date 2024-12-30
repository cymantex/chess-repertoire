import { Chessground } from "@/external/chessground/Chessground.tsx";
import { selectPgn, useRepertoireStore } from "@/app/zustand/store.ts";
import { Chess } from "chess.js";
import { useId } from "react";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { PGN_HEADERS } from "@/features/pgn/defs.ts";

export const MiniChessboard = ({ moves = [] }: { moves?: string[] }) => {
  const pgn = useRepertoireStore(selectPgn);

  const { boardOrientation } = useRepertoireSettings();

  const fen = pgn.headers.get(PGN_HEADERS.FEN);
  const chess = new Chess(fen);
  moves.forEach((move) => chess.move(move));

  return (
    <Chessground
      id={useId()}
      fen={chess.fen()}
      orientation={boardOrientation}
      coordinates={false}
      chessgroundDivProps={{
        style: {
          width: "13rem",
          height: "13rem",
        },
      }}
      viewOnly
    />
  );
};
