import { CSSProperties } from "react";
import { PieceSymbol } from "chess.js/src/chess.ts";
import { CgColor, Column } from "../types.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK } from "chess.js";
import {
  CG_WHITE,
  CJ_PIECE_TO_CG_PIECE,
  COLUMN_NUMBERS,
} from "@/components/Chessboard/constants.ts";
import "./PromotionSelection.scss";
import { useChessRepertoireStore } from "@/store/store.ts";
import {
  selectChess,
  selectPendingPromotionMove,
  selectPromote,
} from "@/store/selectors.ts";
import { determineTurnColor } from "@/components/Chessboard/utils.ts";

export const PromotionSelection = () => {
  const chess = useChessRepertoireStore(selectChess);
  const pendingPromotionMove = useChessRepertoireStore(
    selectPendingPromotionMove,
  );
  const promote = useChessRepertoireStore(selectPromote);

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
