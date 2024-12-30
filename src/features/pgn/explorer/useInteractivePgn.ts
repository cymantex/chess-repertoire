import {
  selectChess,
  selectFen,
  selectPgn,
  useRepertoireStore,
} from "@/app/zustand/store.ts";
import { enrichMovesWithFen } from "@/external/chessops/pgn.ts";
import {
  makePgnMoveTokens,
  PGN_TOKEN_TYPES,
} from "@/external/chessops/makePgnMoveTokens.ts";
import { last } from "lodash";
import type {
  PgnMoveData,
  RenderPgnNodeData} from "@/external/chessops/defs.ts";
import {
  FEN_STARTING_POSITION
} from "@/external/chessops/defs.ts";
import { makeVariation } from "@/features/pgn/utils.ts";
import { selectPendingPromotionMove } from "@/features/chessboard/chessboardSlice.ts";
import { PGN_HEADERS } from "@/features/pgn/defs.ts";

export const useInteractivePgn = () => {
  const fen = useRepertoireStore(selectFen);
  const pgn = useRepertoireStore(selectPgn);
  const chess = useRepertoireStore(selectChess);
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);

  const pgnMoveTokens = makePgnMoveTokens(enrichMovesWithFen(pgn));
  const lastMoveSan = pendingPromotionMove ? undefined : last(chess.history());

  const getVariation = (move: PgnMoveData) => {
    const movesWithFen = pgnMoveTokens
      .filter((token) => token.type === PGN_TOKEN_TYPES.MOVE)
      .map((token) => token.value) as unknown as RenderPgnNodeData[];

    const initialFen = pgn.headers.has(PGN_HEADERS.FEN)
      ? pgn.headers.get(PGN_HEADERS.FEN)!
      : FEN_STARTING_POSITION;

    return makeVariation(movesWithFen, move, initialFen);
  };

  return {
    pgnMoveTokens,
    getVariation,
    disabled: !!pendingPromotionMove,
    isSelectedMove: (move: PgnMoveData) =>
      move.fen === fen && (!lastMoveSan || lastMoveSan === move.san),
  };
};
