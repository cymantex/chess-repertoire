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
import { useNextMovesWithPriority } from "@/hooks/useNextMovesWithPriority.ts";
import { chessground } from "@/external/chessground/Chessground.tsx";
import * as cg from "chessground/types";
import { useRestoreAutoShapesAfterSelection } from "@/components/Chessboard/hooks/useRestoreAutoShapesAfterSelection.tsx";
import {
  createPriorityShapeForSelectedMove,
  useAutoShapes,
} from "@/components/Chessboard/hooks/useAutoShapes.tsx";

export const Chessboard = () => {
  const chess = useRepertoireStore(selectChess);
  const fen = useRepertoireStore(selectFen);
  const orientation = useRepertoireStore(selectOrientation);
  const handleChessgroundMove = useRepertoireStore(selectHandleChessgroundMove);

  const nextMoves = useNextMovesWithPriority();
  const autoShapes = useAutoShapes();

  useRestoreAutoShapesAfterSelection(autoShapes);

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
        select: (square: cg.Key) => {
          if (!chessground) return;

          chessground.setAutoShapes(
            nextMoves
              .filter((move) => move.from === square)
              .map(createPriorityShapeForSelectedMove),
          );
        },
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
        autoShapes,
      }}
    >
      <PromotionSelection />
    </ChessgroundWrapper>
  );
};
