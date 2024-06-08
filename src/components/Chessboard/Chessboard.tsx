import { ChessgroundWrapper } from "@/external/chessground/ChessgroundWrapper.tsx";
import { PromotionSelection } from "@/components/Chessboard/PromotionSelection/PromotionSelection.tsx";
import "@/external/chessground/assets/chessground.base.css";
import "@/external/chessground/assets/chessground.cardinal.css";
import "@/external/chessground/assets/chessground.blue2.css";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import {
  selectChess,
  selectFen,
  selectHandleChessgroundMove,
  selectOrientation,
} from "@/store/selectors.ts";
import {
  calcPossibleDestinations,
  determineTurnColor,
} from "@/external/chessjs/utils.ts";
import { useRepertoireAutoShapes } from "@/components/Chessboard/hooks/useRepertoireAutoShapes.tsx";

export const Chessboard = () => {
  const chess = useRepertoireStore(selectChess);
  const fen = useRepertoireStore(selectFen);
  const orientation = useRepertoireStore(selectOrientation);
  const handleChessgroundMove = useRepertoireStore(selectHandleChessgroundMove);

  const { repertoireAutoShapes, setPriorityShapeForSelection } =
    useRepertoireAutoShapes();

  return (
    <ChessgroundWrapper
      fen={fen}
      turnColor={determineTurnColor(chess)}
      orientation={orientation}
      movable={{
        free: false,
        dests: calcPossibleDestinations(chess),
      }}
      events={{
        move: handleChessgroundMove,
        select: setPriorityShapeForSelection,
      }}
      selectable={{
        enabled: false,
      }}
      chessgroundDivProps={{
        style: {
          width: "var(--cg-width)",
          height: "var(--cg-height)",
        },
      }}
      drawable={{
        autoShapes: repertoireAutoShapes,
      }}
    >
      <PromotionSelection />
    </ChessgroundWrapper>
  );
};
