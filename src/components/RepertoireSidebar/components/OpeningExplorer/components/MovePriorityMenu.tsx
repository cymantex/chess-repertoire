import { MouseEventHandler } from "react";
import {
  selectDeleteMove,
  selectFen,
  selectUpsertMove,
  useCurrentRepertoirePositionMoves,
} from "@/store/selectors.ts";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import classNames from "classnames";
import {
  REPERTOIRE_MOVE_PRIORITY,
  RepertoireMovePriority,
  RepertoireOpeningExplorerMove,
} from "@/defs.ts";
import { WhitePawn } from "@/external/chessground/components/WhitePawn.tsx";
import { WhiteKing } from "@/external/chessground/components/WhiteKing.tsx";
import { WhiteQueen } from "@/external/chessground/components/WhiteQueen.tsx";
import { WhiteRook } from "@/external/chessground/components/WhiteRook.tsx";
import { WhiteBishop } from "@/external/chessground/components/WhiteBishop.tsx";
import { FaTrash } from "react-icons/fa";

interface MovePriorityMenuProps {
  move: RepertoireOpeningExplorerMove;
}

export const MovePriorityMenu = ({ move }: MovePriorityMenuProps) => {
  const fen = useRepertoireStore(selectFen);
  const upsertMove = useRepertoireStore(selectUpsertMove);
  const deleteMove = useRepertoireStore(selectDeleteMove);
  const databaseMove = useCurrentRepertoirePositionMoves().find(
    (databaseMove) => databaseMove.san === move.san,
  );

  const handleMovePriorityClick =
    (priority: RepertoireMovePriority): MouseEventHandler<SVGElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      return upsertMove(
        fen,
        {
          san: move.san,
          priority: priority === databaseMove?.priority ? undefined : priority,
        },
        false,
      );
    };

  const createPriorityIconProps = (priority: RepertoireMovePriority) => ({
    className: classNames(
      "transition-all hover:scale-150 rounded cursor-pointer",
      {
        "bg-board-dark-square": databaseMove?.priority === priority,
      },
    ),
    onClick: handleMovePriorityClick(priority),
  });

  return (
    <div
      className="flex gap-2 text-base cursor-default items-center w-max"
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
      {databaseMove ? (
        <FaTrash
          title="Delete move from repertoire"
          className={classNames(
            "transition-all hover:scale-150 rounded cursor-pointer",
            {
              "opacity-0": !databaseMove,
            },
          )}
          onClick={() => deleteMove(fen, move.san)}
        />
      ) : (
        <FaTrash className="opacity-0" />
      )}
    </div>
  );
};
