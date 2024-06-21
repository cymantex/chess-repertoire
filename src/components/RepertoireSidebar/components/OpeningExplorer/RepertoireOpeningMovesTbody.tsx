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
  toOrderedRepertoireOpeningExplorerMoves,
} from "@/components/RepertoireSidebar/components/OpeningExplorer/utils.ts";
import { MoveAnnotationMenu } from "@/components/RepertoireSidebar/components/OpeningExplorer/components/MoveAnnotationMenu.tsx";
import { userSelectionExists } from "@/external/chessground/utils.ts";

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

  // TODO: Display stats on hover
  return (
    <>
      {toOrderedRepertoireOpeningExplorerMoves(
        chess,
        openingExplorerMoves,
        repertoireMoves,
      ).map((move) => (
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
          <td>{calcTotalGames(move)}</td>
          <td>
            <MoveAnnotationMenu move={move} />
          </td>
        </tr>
      ))}
    </>
  );
};
