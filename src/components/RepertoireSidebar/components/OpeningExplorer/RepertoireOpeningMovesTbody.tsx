import { OpeningExplorerMove } from "@/defs.ts";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import {
  selectChess,
  selectFen,
  selectHandleOpeningExplorerMove,
  selectSetHoveredOpeningMove,
} from "@/store/selectors.ts";
import { useDatabasePositionMoves } from "@/store/database/hooks.ts";
import {
  calcTotalGames,
  toOrderedRepertoireOpeningExplorerMoves,
} from "@/components/RepertoireSidebar/components/OpeningExplorer/utils.ts";
import { MovePriorityMenu } from "@/components/RepertoireSidebar/components/OpeningExplorer/components/MovePriorityMenu.tsx";

interface RepertoireOpeningMovesProps {
  openingExplorerMoves: OpeningExplorerMove[];
}

export const RepertoireOpeningMovesTbody = ({
  openingExplorerMoves,
}: RepertoireOpeningMovesProps) => {
  const fen = useRepertoireStore(selectFen);
  const chess = useRepertoireStore(selectChess);
  const setHoveredOpeningMove = useRepertoireStore(selectSetHoveredOpeningMove);
  const handleOpeningExplorerMove = useRepertoireStore(
    selectHandleOpeningExplorerMove,
  );
  const repertoireMoves = useDatabasePositionMoves(fen);

  const isRepertoireMove = (san: string) =>
    repertoireMoves?.some((move) => move.san === san);

  return (
    <tbody>
      {toOrderedRepertoireOpeningExplorerMoves(
        chess,
        openingExplorerMoves,
        repertoireMoves,
      ).map((move) => (
        <tr
          className="hover cursor-pointer"
          key={move.san}
          onClick={() => handleOpeningExplorerMove(move)}
          onMouseEnter={() => setHoveredOpeningMove(move)}
          onMouseLeave={() => setHoveredOpeningMove(null)}
        >
          <td>
            {isRepertoireMove(move.san) ? (
              <span className="color-board-light-square font-bold">
                {move.san}
              </span>
            ) : (
              move.san
            )}
          </td>
          <td>{calcTotalGames(move)}</td>
          <td>
            <MovePriorityMenu move={move} />
          </td>
        </tr>
      ))}
    </tbody>
  );
};
