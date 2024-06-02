import { WHITE } from "chess.js";
import { CgColor } from "@/chessboard/types.ts";
import { CG_BLACK, CG_WHITE } from "@/chessboard/constants.ts";
import { ChessgroundWrapper } from "@/external/chessground/ChessgroundWrapper.tsx";
import { PromotionSelection } from "@/chessboard/PromotionSelection/PromotionSelection.tsx";
import "@/external/chessground/assets/chessground.base.css";
import "@/external/chessground/assets/chessground.cardinal.css";
import "@/external/chessground/assets/chessground.blue2.css";
import { calcPossibleDestinations } from "@/chessboard/utils.ts";
import { useChessRepertoireStore } from "@/store/store.ts";
import {
  selectChess,
  selectFen,
  selectHandleChessgroundMove,
  selectHoveredOpeningMove,
  selectOrientation,
} from "@/store/selectors.ts";

export const Chessboard = () => {
  const chess = useChessRepertoireStore(selectChess);
  const fen = useChessRepertoireStore(selectFen);
  const orientation = useChessRepertoireStore(selectOrientation);
  const hoveredOpeningMove = useChessRepertoireStore(selectHoveredOpeningMove);
  const handleChessgroundMove = useChessRepertoireStore(
    selectHandleChessgroundMove,
  );

  const turnColor: CgColor = chess.turn() === WHITE ? CG_WHITE : CG_BLACK;

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
            }
          : {
              shapes: [
                {
                  orig: "d3",
                  customSvg: {
                    html: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 0c17.7 0 32 14.3 32 32V48h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H256v48H408c22.1 0 40 17.9 40 40c0 5.3-1 10.5-3.1 15.4L368 400H80L3.1 215.4C1 210.5 0 205.3 0 200c0-22.1 17.9-40 40-40H192V112H176c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V32c0-17.7 14.3-32 32-32zM38.6 473.4L80 432H368l41.4 41.4c4.2 4.2 6.6 10 6.6 16c0 12.5-10.1 22.6-22.6 22.6H54.6C42.1 512 32 501.9 32 489.4c0-6 2.4-11.8 6.6-16z"></path></svg>`,
                    center: "orig",
                  },
                },
              ],
            }
      }
    >
      <PromotionSelection />
    </ChessgroundWrapper>
  );
};
