import { useState } from "react";
import { Chess, Move, PAWN, WHITE } from "chess.js";
import { CgColor } from "@/chessjs-chessground/types.ts";
import { CG_BLACK, CG_WHITE } from "@/chessjs-chessground/constants.ts";
import { Key } from "chessground/types";
import { PieceSymbol } from "chess.js/src/chess.ts";
import {
  ChessgroundWrapper,
  ChessgroundWrapperProps,
} from "@/chessground/ChessgroundWrapper.tsx";
import {
  PromotionSelection,
  PromotionSelectionProps,
} from "@/chessjs-chessground/PromotionSelection/PromotionSelection.tsx";
import "@/chessground/assets/chessground.base.css";
import "@/chessground/assets/chessground.cburnett.css";
import "@/chessground/assets/chessground.brown.css";
import {
  calcPossibleDestinations,
  determineMoveType,
} from "@/chessjs-chessground/utils.ts";

interface CjChessgroundProps extends Partial<ChessgroundWrapperProps> {
  promotionSelectionProps?: Partial<PromotionSelectionProps>;
}

export const CjChessground = ({
  promotionSelectionProps,
  ...chessgroundProps
}: CjChessgroundProps) => {
  const { movable, events, chessgroundDivProps } = chessgroundProps;

  const [fen, setFen] = useState("");
  const [chess] = useState(new Chess());
  const [lastMove, setLastMove] = useState<Move>();
  const [pendingPromotionMove, setPendingPromotionMove] = useState<Move>();
  const turnColor: CgColor = chess.turn() === WHITE ? CG_WHITE : CG_BLACK;

  const handlePromotionMove = (promotionMove: Move) => {
    // Hide pawn to indicate that the promotion is about to happen
    chess.remove(promotionMove.from);
    setPendingPromotionMove(promotionMove);
    setFen(chess.fen());
  };

  const handleNormalMove = (normalMove: Move) => {
    const nextMove = chess.move(normalMove);

    if (nextMove) {
      setFen(chess.fen());
      setLastMove(nextMove);
    }
  };

  const handlePromotionSelection = (promotion: PieceSymbol) => {
    if (!pendingPromotionMove) return;

    // Add back the pawn hidden before doing the promotion
    chess.put({ type: PAWN, color: chess.turn() }, pendingPromotionMove.from);
    chess.move({ ...pendingPromotionMove, promotion });
    setFen(chess.fen());
    setLastMove(pendingPromotionMove);
    setPendingPromotionMove(undefined);
  };

  return (
    <ChessgroundWrapper
      fen={fen}
      turnColor={turnColor}
      movable={{
        free: false,
        dests: calcPossibleDestinations(chess),
        ...movable,
      }}
      lastMove={lastMove ? [lastMove.from, lastMove.to] : []}
      events={{
        move: (from: Key, to: Key) =>
          determineMoveType({
            chess,
            from,
            to,
            onPromotionMove: handlePromotionMove,
            onNormalMove: handleNormalMove,
          }),
        ...events,
      }}
      chessgroundDivProps={{
        // TODO: Resize support
        style: {
          width: "800px",
          height: "800px",
        },
        ...chessgroundDivProps,
      }}
    >
      <PromotionSelection
        to={pendingPromotionMove?.to}
        onPromotionSelection={handlePromotionSelection}
        color={turnColor}
        {...promotionSelectionProps}
      />
    </ChessgroundWrapper>
  );
};
