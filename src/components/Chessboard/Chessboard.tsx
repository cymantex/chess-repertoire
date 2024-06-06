import { ChessgroundWrapper } from "@/external/chessground/ChessgroundWrapper.tsx";
import { PromotionSelection } from "@/components/Chessboard/PromotionSelection/PromotionSelection.tsx";
import "@/external/chessground/assets/chessground.base.css";
import "@/external/chessground/assets/chessground.cardinal.css";
import "@/external/chessground/assets/chessground.blue2.css";
import {
  calcPossibleDestinations,
  determineTurnColor,
} from "@/components/Chessboard/utils.ts";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import {
  selectChess,
  selectFen,
  selectHandleChessgroundMove,
  selectHoveredOpeningMove,
  selectOrientation,
} from "@/store/selectors.ts";

export const Chessboard = () => {
  const chess = useRepertoireStore(selectChess);
  const fen = useRepertoireStore(selectFen);
  const orientation = useRepertoireStore(selectOrientation);
  const hoveredOpeningMove = useRepertoireStore(selectHoveredOpeningMove);
  const handleChessgroundMove = useRepertoireStore(selectHandleChessgroundMove);

  // TODO: Get database move priorities and draw shapes

  const shapes = hoveredOpeningMove
    ? [
        {
          orig: hoveredOpeningMove?.from,
          dest: hoveredOpeningMove?.to,
          brush: "blue",
        },
      ]
    : [];

  const turnColor = determineTurnColor(chess);

  return (
    <ChessgroundWrapper
      fen={fen}
      turnColor={turnColor}
      orientation={orientation}
      movable={{
        free: false,
        dests: calcPossibleDestinations(chess),
      }}
      events={{
        move: handleChessgroundMove,
      }}
      chessgroundDivProps={{
        style: {
          width: "var(--cg-width)",
          height: "var(--cg-height)",
        },
      }}
      // TODO: Show priority + Add back shapes onChange
      drawable={{
        autoShapes: shapes,
      }}
    >
      <PromotionSelection />
    </ChessgroundWrapper>
  );
};
