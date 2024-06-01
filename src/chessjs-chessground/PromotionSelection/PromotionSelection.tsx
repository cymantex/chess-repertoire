import { CSSProperties } from "react";
import { PieceSymbol, Square } from "chess.js/src/chess.ts";
import { CgColor, Column } from "../types.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK } from "chess.js";
import { CG_WHITE, COLUMN_NUMBERS } from "@/chessjs-chessground/constants.ts";
import "./PromotionSelection.scss";

export interface PromotionSelectionProps {
  to?: Square;
  onPromotionSelection: (promotion: PieceSymbol) => void;
  color: CgColor;
}

export const PromotionSelection = ({
  to,
  onPromotionSelection,
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
    <div className="cg-wrap cg-promotion">
      <div className="cg-promotion__column" style={calcPromotionStyle()}>
        <div
          className={`square piece queen ${color}`}
          onClick={() => onPromotionSelection(QUEEN)}
        />
        <div
          className={`square piece knight ${color}`}
          onClick={() => onPromotionSelection(KNIGHT)}
        />
        <div
          className={`square piece rook ${color}`}
          onClick={() => onPromotionSelection(ROOK)}
        />
        <div
          className={`square piece bishop ${color}`}
          onClick={() => onPromotionSelection(BISHOP)}
        />
      </div>
    </div>
  );
};
