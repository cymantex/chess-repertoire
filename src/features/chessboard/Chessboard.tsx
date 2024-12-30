import { ChessgroundWrapper } from "@/external/chessground/ChessgroundWrapper.tsx";
import { PromotionSelection } from "@/features/chessboard/PromotionSelection/PromotionSelection.tsx";
import "@/external/chessground/assets/chessground.base.css";
import "@/external/chessground/assets/chessground.pieces.css";
import "@/external/chessground/assets/chessground.board.css";
import {
  selectChess,
  selectFen,
  useRepertoireStore,
} from "@/app/zustand/store.ts";
import { calcPossibleDestinations } from "@/external/chessjs/utils.ts";
import { useRepertoireAutoShapes } from "@/features/chessboard/hooks/useRepertoireAutoShapes.tsx";
import { DEFAULT_BRUSHES } from "@/external/chessground/defs.tsx";

import { CG_ID, determineTurnColor } from "@/features/chessboard/utils.ts";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { selectHandleChessgroundMove } from "@/features/chessboard/chessboardSlice.ts";
import {
  selectCurrentRepertoirePositionShapes,
  selectSetShapes,
} from "@/features/repertoire/repertoireSlice.ts";

export const Chessboard = () => {
  const chess = useRepertoireStore(selectChess);
  const fen = useRepertoireStore(selectFen);
  const handleChessgroundMove = useRepertoireStore(selectHandleChessgroundMove);
  const shapes = useRepertoireStore(selectCurrentRepertoirePositionShapes);
  const setShapes = useRepertoireStore(selectSetShapes);

  const { boardOrientation } = useRepertoireSettings();

  const { repertoireAutoShapes, setAnnotationShapeForSelection } =
    useRepertoireAutoShapes();

  return (
    <ChessgroundWrapper
      id={CG_ID}
      fen={fen}
      coordinates
      turnColor={determineTurnColor(chess)}
      orientation={boardOrientation}
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
