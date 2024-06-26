import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectFen,
  selectPendingPromotionMove,
  selectPgn,
} from "@/stores/zustand/selectors.ts";
import { enrichMovesWithFen } from "@/external/chessops/pgn.ts";
import {
  makePgnMoveTokens,
  PGN_TOKEN_TYPES,
} from "@/external/chessops/makePgnMoveTokens.ts";
import { last } from "lodash";
import { PgnMoveData, RenderPgnNodeData } from "@/external/chessops/defs.ts";
import { makeVariation } from "@/utils/utils.ts";

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

    return makeVariation(movesWithFen, move);
  };

  return {
    pgnMoveTokens,
    getVariation,
    disabled: !!pendingPromotionMove,
    isSelectedMove: (move: PgnMoveData) =>
      move.fen === fen && (!lastMoveSan || lastMoveSan === move.san),
  };
};
