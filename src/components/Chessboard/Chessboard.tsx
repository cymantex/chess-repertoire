import { ChessgroundWrapper } from "@/external/chessground/ChessgroundWrapper.tsx";
import { PromotionSelection } from "@/components/Chessboard/PromotionSelection/PromotionSelection.tsx";
import "@/external/chessground/assets/chessground.base.css";
import "@/external/chessground/assets/chessground.pieces.css";
import "@/external/chessground/assets/chessground.board.css";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectCurrentRepertoirePositionShapes,
  selectFen,
  selectHandleChessgroundMove,
  selectOrientation,
  selectSetShapes,
} from "@/stores/zustand/selectors.ts";
import { calcPossibleDestinations } from "@/external/chessjs/utils.ts";
import { useRepertoireAutoShapes } from "@/components/Chessboard/hooks/useRepertoireAutoShapes.tsx";
import { DEFAULT_BRUSHES } from "@/external/chessground/defs.tsx";

import { CG_ID, determineTurnColor } from "@/components/Chessboard/utils.ts";

export const Chessboard = () => {
  const chess = useRepertoireStore(selectChess);
  const fen = useRepertoireStore(selectFen);
  const orientation = useRepertoireStore(selectOrientation);
  const handleChessgroundMove = useRepertoireStore(selectHandleChessgroundMove);
  const shapes = useRepertoireStore(selectCurrentRepertoirePositionShapes);
  const setShapes = useRepertoireStore(selectSetShapes);

  const { repertoireAutoShapes, setAnnotationShapeForSelection } =
    useRepertoireAutoShapes();

  return (
    <ChessgroundWrapper
      id={CG_ID}
      fen={fen}
      coordinates
      turnColor={determineTurnColor(chess)}
      orientation={orientation}
      movable={{
        free: false,
        dests: calcPossibleDestinations(chess),
      }}
      events={{
        move: handleChessgroundMove,
        select: setAnnotationShapeForSelection,
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
        eraseOnClick: false,
        brushes: DEFAULT_BRUSHES,
      }}
    >
      <PromotionSelection />
    </ChessgroundWrapper>
  );
};
