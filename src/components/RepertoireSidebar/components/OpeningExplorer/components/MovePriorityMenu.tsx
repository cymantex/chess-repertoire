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

interface MovePriorityMenuProps {
  move: OpeningExplorerMove;
}

export const MovePriorityMenu = ({ move }: MovePriorityMenuProps) => {
  const fen = useRepertoireStore(selectFen);

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

  return (
    <div className="flex gap-2 text-base">
      <FaChessKing
        className="transition-all hover:scale-150"
        onClick={handleMovePriorityClick(REPERTOIRE_MOVE_PRIORITY.KING)}
      />
      <FaChessQueen
        className="transition-all hover:scale-150"
        onClick={handleMovePriorityClick(REPERTOIRE_MOVE_PRIORITY.QUEEN)}
      />
      <FaChessRook
        className="transition-all hover:scale-150"
        onClick={handleMovePriorityClick(REPERTOIRE_MOVE_PRIORITY.ROOK)}
      />
      <FaChessBishop
        className="transition-all hover:scale-150"
        onClick={handleMovePriorityClick(REPERTOIRE_MOVE_PRIORITY.BISHOP)}
      />
      <FaChessPawn
        className="transition-all hover:scale-150"
        onClick={handleMovePriorityClick(REPERTOIRE_MOVE_PRIORITY.PAWN)}
      />
    </div>
  );
};
