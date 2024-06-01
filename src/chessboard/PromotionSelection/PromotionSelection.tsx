import { CSSProperties } from "react";
import { PieceSymbol, Square } from "chess.js/src/chess.ts";
import { CgColor, Column } from "../types.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK } from "chess.js";
import {
  CG_WHITE,
  CJ_PIECE_TO_CG_PIECE,
  COLUMN_NUMBERS,
} from "@/chessboard/constants.ts";
import "./PromotionSelection.scss";

export interface PromotionSelectionProps {
  to?: Square;
  onPromotion: (promotion: PieceSymbol) => void;
  color: CgColor;
}

export const PromotionSelection = ({
  to,
  onPromotion,
  color,
}: PromotionSelectionProps) => {
  if (!to) return null;

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
        <PromotionSquare piece={QUEEN} color={color} onClick={onPromotion} />
        <PromotionSquare piece={KNIGHT} color={color} onClick={onPromotion} />
        <PromotionSquare piece={ROOK} color={color} onClick={onPromotion} />
        <PromotionSquare piece={BISHOP} color={color} onClick={onPromotion} />
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
