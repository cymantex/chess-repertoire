import { Chessground } from "@/external/chessground/Chessground.tsx";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectOrientation, selectPgn } from "@/stores/zustand/selectors.ts";
import { Chess } from "chess.js";
import { PGN_HEADERS } from "@/defs.ts";
import { useId } from "react";

export const MiniChessboard = ({ moves = [] }: { moves?: string[] }) => {
  const pgn = useRepertoireStore(selectPgn);
  const orientation = useRepertoireStore(selectOrientation);

  const fen = pgn.headers.get(PGN_HEADERS.FEN);
  const chess = new Chess(fen);
  moves.forEach((move) => chess.move(move));

  return (
    <Chessground
      id={useId()}
      fen={chess.fen()}
      orientation={orientation}
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
