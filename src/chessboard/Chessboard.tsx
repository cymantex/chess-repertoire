import { WHITE } from "chess.js";
import { CgColor } from "@/chessboard/types.ts";
import { CG_BLACK, CG_WHITE } from "@/chessboard/constants.ts";
import {
  ChessgroundWrapper,
  ChessgroundWrapperProps,
} from "@/external/chessground/ChessgroundWrapper.tsx";
import {
  PromotionSelection,
  PromotionSelectionProps,
} from "@/chessboard/PromotionSelection/PromotionSelection.tsx";
import "@/external/chessground/assets/chessground.base.css";
import "@/external/chessground/assets/chessground.cburnett.css";
import "@/external/chessground/assets/chessground.brown.css";
import { calcPossibleDestinations } from "@/chessboard/utils.ts";
import { useChessRepertoireStore } from "@/store.ts";

interface CjChessgroundProps extends Partial<ChessgroundWrapperProps> {
  promotionSelectionProps?: Partial<PromotionSelectionProps>;
}

export const Chessboard = ({
  promotionSelectionProps,
  ...chessgroundProps
}: CjChessgroundProps) => {
  const { movable, events, chessgroundDivProps } = chessgroundProps;

  const {
    chess,
    fen,
    lastMove,
    pendingPromotionMove,
    handleChessgroundMove,
    handlePromotion,
  } = useChessRepertoireStore();

  const turnColor: CgColor = chess.turn() === WHITE ? CG_WHITE : CG_BLACK;

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
        move: handleChessgroundMove,
        ...events,
      }}
      chessgroundDivProps={{
        style: {
          width: "var(--cg-width)",
          height: "var(--cg-height)",
        },
        ...chessgroundDivProps,
      }}
    >
      <PromotionSelection
        to={pendingPromotionMove?.to}
        onPromotion={handlePromotion}
        color={turnColor}
        {...promotionSelectionProps}
      />
    </ChessgroundWrapper>
  );
};
