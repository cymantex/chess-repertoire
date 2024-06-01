import { CSSProperties } from "react";
import { PieceSymbol, Square } from "chess.js/src/chess.ts";
import { CgColor, Column } from "../types.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK } from "chess.js";
import {
  CG_WHITE,
  CJ_PIECE_TO_CG_PIECE,
  COLUMN_NUMBERS,
} from "@/chessjs-chessground/constants.ts";
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
    <div className="cg-wrap cj-promotion">
      <div className="cj-promotion__column" style={calcPromotionStyle()}>
        <PromotionSquare
          piece={QUEEN}
          color={color}
          onClick={onPromotionSelection}
        />
        <PromotionSquare
          piece={KNIGHT}
          color={color}
          onClick={onPromotionSelection}
        />
        <PromotionSquare
          piece={ROOK}
          color={color}
          onClick={onPromotionSelection}
        />
        <PromotionSquare
          piece={BISHOP}
          color={color}
          onClick={onPromotionSelection}
        />
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
