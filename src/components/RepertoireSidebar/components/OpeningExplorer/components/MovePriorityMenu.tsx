import {
  FaChessBishop,
  FaChessKing,
  FaChessPawn,
  FaChessQueen,
  FaChessRook,
} from "react-icons/fa6";
import { OpeningExplorerMove } from "@/components/RepertoireSidebar/components/types.ts";
import {
  REPERTOIRE_MOVE_PRIORITY,
  RepertoireMovePriority,
} from "@/store/database/types.ts";
import { MouseEventHandler } from "react";
import { repertoireDatabaseStore } from "@/store/database/repertoireDatabaseStore.ts";
import { selectFen } from "@/store/selectors.ts";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import { useDatabasePositionMoves } from "@/store/database/hooks.ts";
import classNames from "classnames";

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
        priority,
      });
      console.warn(event);
    };

  const createPriorityIconProps = (priority: RepertoireMovePriority) => ({
    className: classNames("transition-all hover:scale-150", {
      "text-yellow-600": databaseMove?.priority === priority,
    }),
    onClick: handleMovePriorityClick(priority),
  });

  return (
    <div className="flex gap-2 text-base">
      <FaChessKing
        {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.KING)}
      />
      <FaChessQueen
        {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.QUEEN)}
      />
      <FaChessRook
        {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.ROOK)}
      />
      <FaChessBishop
        {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.BISHOP)}
      />
      <FaChessPawn
        {...createPriorityIconProps(REPERTOIRE_MOVE_PRIORITY.PAWN)}
      />
    </div>
  );
};
