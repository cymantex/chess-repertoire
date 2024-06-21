import { OpeningExplorerMove } from "@/defs.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectCurrentRepertoirePositionMoves,
  selectHandleOpeningExplorerMove,
  selectSetHoveredOpeningMove,
} from "@/stores/zustand/selectors.ts";
import {
  calcTotalGames,
  isOpeningExplorerMove,
  toOrderedRepertoireOpeningExplorerMoves,
} from "@/components/RepertoireSidebar/components/OpeningExplorer/utils.ts";
import { MoveAnnotationMenu } from "@/components/RepertoireSidebar/components/OpeningExplorer/components/MoveAnnotationMenu.tsx";
import { userSelectionExists } from "@/external/chessground/utils.ts";
import { MoveStats } from "@/components/RepertoireSidebar/components/OpeningExplorer/MoveStats.tsx";

interface RepertoireOpeningMovesProps {
  openingExplorerMoves: OpeningExplorerMove[];
}

export const RepertoireOpeningMovesTbody = ({
  openingExplorerMoves,
}: RepertoireOpeningMovesProps) => {
  const chess = useRepertoireStore(selectChess);
  const setHoveredOpeningMove = useRepertoireStore(selectSetHoveredOpeningMove);
  const handleOpeningExplorerMove = useRepertoireStore(
    selectHandleOpeningExplorerMove,
  );
  const repertoireMoves =
    useRepertoireStore(selectCurrentRepertoirePositionMoves) ?? [];

  const isRepertoireMove = (san: string) =>
    repertoireMoves?.some((move) => move.san === san);

  const orderedOpeningMoves = toOrderedRepertoireOpeningExplorerMoves(
    chess,
    openingExplorerMoves,
    repertoireMoves,
  );

  const totalGames = orderedOpeningMoves
    .filter(isOpeningExplorerMove)
    .map(calcTotalGames)
    .reduce((a, b) => a + b, 0);

  return (
    <>
      {orderedOpeningMoves.map((move) => (
        <tr
          className="hover cursor-pointer"
          key={move.san}
          onClick={() => handleOpeningExplorerMove(move)}
          onMouseEnter={() =>
            !userSelectionExists() && setHoveredOpeningMove(move)
          }
          onMouseLeave={() =>
            !userSelectionExists() && setHoveredOpeningMove(null)
          }
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
          <td>
            <MoveStats totalGamesForPosition={totalGames} move={move} />
          </td>
          <td>
            <MoveAnnotationMenu move={move} />
          </td>
        </tr>
      ))}
    </>
  );
};
