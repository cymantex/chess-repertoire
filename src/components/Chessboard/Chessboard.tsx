import { ChessgroundWrapper } from "@/external/chessground/ChessgroundWrapper.tsx";
import { PromotionSelection } from "@/components/Chessboard/PromotionSelection/PromotionSelection.tsx";
import "@/external/chessground/assets/chessground.base.css";
import "@/external/chessground/assets/chessground.cardinal.css";
import "@/external/chessground/assets/chessground.blue2.css";
import { useRepertoireStore } from "@/store/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectCurrentRepertoirePositionShapes,
  selectFen,
  selectHandleChessgroundMove,
  selectOrientation,
  selectSetShapes,
} from "@/store/zustand/selectors.ts";
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
  const shapes = useRepertoireStore(selectCurrentRepertoirePositionShapes);
  const setShapes = useRepertoireStore(selectSetShapes);

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
        shapes,
        autoShapes: repertoireAutoShapes,
        onChange: setShapes,
      }}
    >
      <PromotionSelection />
    </ChessgroundWrapper>
  );
};
