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
import "@/external/chessground/assets/chessground.cardinal.css";
import "@/external/chessground/assets/chessground.blue2.css";
import { calcPossibleDestinations } from "@/chessboard/utils.ts";
import { useChessRepertoireStore } from "@/store.ts";

interface CjChessgroundProps extends Partial<ChessgroundWrapperProps> {
  promotionSelectionProps?: Partial<PromotionSelectionProps>;
}

export const Chessboard = ({
  promotionSelectionProps,
  ...chessgroundProps
}: CjChessgroundProps) => {
  const { drawable, movable, events, chessgroundDivProps } = chessgroundProps;

  const {
    chess,
    fen,
    orientation,
    lastMove,
    hoveredOpeningMove,
    pendingPromotionMove,
    handleChessgroundMove,
    handlePromotion,
  } = useChessRepertoireStore();

  const turnColor: CgColor = chess.turn() === WHITE ? CG_WHITE : CG_BLACK;

  return (
    <ChessgroundWrapper
      fen={fen}
      turnColor={turnColor}
      orientation={orientation}
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
      drawable={
        hoveredOpeningMove
          ? {
              shapes: [
                {
                  orig: hoveredOpeningMove?.from,
                  dest: hoveredOpeningMove?.to,
                  brush: "blue",
                },
              ],
              ...drawable,
            }
          : {
              ...drawable,
            }
      }
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
