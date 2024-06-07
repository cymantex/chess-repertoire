import { MouseEventHandler } from "react";
import { repertoireDatabaseStore } from "@/store/database/repertoireDatabaseStore.ts";
import { selectFen } from "@/store/selectors.ts";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import { useDatabasePositionMoves } from "@/store/database/hooks.ts";
import classNames from "classnames";
import {
  OpeningExplorerMove,
  REPERTOIRE_MOVE_PRIORITY,
  RepertoireMovePriority,
} from "@/defs.ts";
import { WhitePawn } from "@/external/chessground/components/WhitePawn.tsx";
import { WhiteKing } from "@/external/chessground/components/WhiteKing.tsx";
import { WhiteQueen } from "@/external/chessground/components/WhiteQueen.tsx";
import { WhiteRook } from "@/external/chessground/components/WhiteRook.tsx";
import { WhiteBishop } from "@/external/chessground/components/WhiteBishop.tsx";

interface MovePriorityMenuProps {
  move: OpeningExplorerMove;
}

export const MovePriorityMenu = ({ move }: MovePriorityMenuProps) => {
  const fen = useRepertoireStore(selectFen);
  const databaseMove = useDatabasePositionMoves(fen).find(
    (databaseMove) => databaseMove.san === move.san,
  );

  const handleMovePriorityClick =
    (priority: RepertoireMovePriority): MouseEventHandler<SVGElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      repertoireDatabaseStore.upsertMove(fen, {
        san: move.san,
        priority: priority === databaseMove?.priority ? undefined : priority,
      });
    };

  const createPriorityIconProps = (priority: RepertoireMovePriority) => ({
    className: classNames(
      "transition-all hover:scale-150 rounded cursor-pointer",
      {
        "bg-board-dark-blue": databaseMove?.priority === priority,
      },
    ),
    onClick: handleMovePriorityClick(priority),
  });

  return (
    <div
      className="flex gap-2 text-base cursor-default w-max"
      onClick={(e) => e.stopPropagation()}
    >
      <WhiteKing {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.KING)} />
      <WhiteQueen
        {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.QUEEN)}
      />
      <WhiteRook {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.ROOK)} />
      <WhiteBishop
        {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.BISHOP)}
      />
      <WhitePawn {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.PAWN)} />
    </div>
  );
};
