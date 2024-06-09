import { CSSProperties } from "react";
import { PieceSymbol } from "chess.js/src/chess.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK } from "chess.js";
import { Column, COLUMN_NUMBERS } from "@/defs.ts";
import "./PromotionSelection.scss";
import { useRepertoireStore } from "@/store/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectPendingPromotionMove,
  selectPromote,
} from "@/store/zustand/selectors.ts";

import { determineTurnColor } from "@/external/chessjs/utils.ts";
import { CG_WHITE, CgColor } from "@/external/chessground/defs.tsx";
import { CJ_PIECE_TO_CG_PIECE } from "@/external/chessjs/defs.ts";

export const PromotionSelection = () => {
  const chess = useRepertoireStore(selectChess);
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);
  const promote = useRepertoireStore(selectPromote);

  if (!pendingPromotionMove?.to) return null;

  const { to } = pendingPromotionMove;
  const color = determineTurnColor(chess);

  // Helps to place the promotion selection on the coordinate where the
  // pawn is about to be promoted
  const calcPromotionStyle = (): CSSProperties => {
    const columnNumber = COLUMN_NUMBERS[to[0] as Column] ?? 0;

    return {
      top: color === CG_WHITE ? "0" : "50%",
      left: `${columnNumber * 12.5}%`,
      flexDirection: color === CG_WHITE ? "column" : "column-reverse",
    };
  };

  return (
    <div className="cg-wrap cj-promotion">
      <div className="cj-promotion__column" style={calcPromotionStyle()}>
        <PromotionSquare piece={QUEEN} color={color} onClick={promote} />
        <PromotionSquare piece={KNIGHT} color={color} onClick={promote} />
        <PromotionSquare piece={ROOK} color={color} onClick={promote} />
        <PromotionSquare piece={BISHOP} color={color} onClick={promote} />
      </div>
    </div>
  );
};

const PromotionSquare = (props: {
  piece: PieceSymbol;
  color: CgColor;
  onClick: (piece: PieceSymbol) => void;
}) => (
  <div
    className={`square piece ${CJ_PIECE_TO_CG_PIECE[props.piece]} ${props.color}`}
    onClick={() => props.onClick(props.piece)}
  >
    <div className="cj-backdrop" />
  </div>
);
