import { CSSProperties } from "react";
import { PieceSymbol } from "chess.js/src/chess.ts";
import { BISHOP, KNIGHT, QUEEN, ROOK } from "chess.js";
import "./PromotionSelection.scss";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectOrientation,
  selectPendingPromotionMove,
  selectPromote,
} from "@/stores/zustand/selectors.ts";

import { CG_WHITE, CgColor } from "@/external/chessground/defs.tsx";
import { CJ_PIECE_TO_CG_PIECE } from "@/external/chessjs/defs.ts";

import { determineTurnColor } from "@/components/Chessboard/utils.ts";

const COLUMN_NUMBERS = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
} as const;

type Column = keyof typeof COLUMN_NUMBERS;

export const PromotionSelection = () => {
  const chess = useRepertoireStore(selectChess);
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);
  const promote = useRepertoireStore(selectPromote);
  const orientation = useRepertoireStore(selectOrientation);

  if (!pendingPromotionMove?.to) return null;

  const { to } = pendingPromotionMove;
  const color = determineTurnColor(chess);

  // Helps to place the promotion selection on the coordinate where the
  // pawn is about to be promoted
  const calcPromotionStyle = (): CSSProperties => {
    const columnNumber = COLUMN_NUMBERS[to[0] as Column] ?? 0;

    const whiteToMove = color === CG_WHITE;

    if (orientation === CG_WHITE) {
      return {
        top: whiteToMove ? "0" : "50%",
        left: `${columnNumber * 12.5}%`,
        flexDirection: whiteToMove ? "column" : "column-reverse",
      };
    }

    return {
      top: whiteToMove ? "50%" : "0",
      right: `${columnNumber * 12.5}%`,
      flexDirection: whiteToMove ? "column-reverse" : "column",
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
