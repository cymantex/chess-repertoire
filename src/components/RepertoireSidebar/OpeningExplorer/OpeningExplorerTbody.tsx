import { OpeningExplorerMove } from "@/defs.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectCurrentRepertoirePositionMoves,
  selectHandleOpeningExplorerMove,
  selectSetHoveredOpeningMove,
} from "@/stores/zustand/selectors.ts";
import {
  calcPercentage,
  calcPositionStats,
  toOrderedRepertoireOpeningExplorerMoves,
} from "@/components/RepertoireSidebar/OpeningExplorer/utils.ts";
import { MoveAnnotationMenu } from "@/components/RepertoireSidebar/OpeningExplorer/MoveAnnotationMenu.tsx";
import { userSelectionExists } from "@/external/chessground/utils.ts";
import { MoveStats } from "@/components/RepertoireSidebar/OpeningExplorer/MoveStats.tsx";
import { LuSigma } from "react-icons/lu";
import { WinPercentageBar } from "@/components/RepertoireSidebar/OpeningExplorer/WinPercentageBar.tsx";
import { LargeNumber } from "@/components/RepertoireSidebar/OpeningExplorer/LargeNumber.tsx";
import { CG_ID } from "@/components/Chessboard/utils.ts";

interface OpeningExplorerTbodyProps {
  openingExplorerMoves?: OpeningExplorerMove[];
}

export const OpeningExplorerTbody = ({
  openingExplorerMoves = [],
}: OpeningExplorerTbodyProps) => {
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

  const positionStats = calcPositionStats(openingExplorerMoves);

  return (
    <>
      {orderedOpeningMoves.map((move) => (
        <tr
          className="hover cursor-pointer"
          key={move.san}
          onClick={() => handleOpeningExplorerMove(move)}
          onMouseEnter={() =>
            !userSelectionExists(CG_ID) && setHoveredOpeningMove(move)
          }
          onMouseLeave={() =>
            !userSelectionExists(CG_ID) && setHoveredOpeningMove(null)
          }
        >
          <td className="font-chess">
            {isRepertoireMove(move.san) ? (
              <span className="text-neutral font-bold">{move.san}</span>
            ) : (
              move.san
            )}
          </td>
          <td>
            <MoveStats
              totalGamesForPosition={positionStats.totalGames}
              move={move}
            />
          </td>
          <td>
            <MoveAnnotationMenu move={move} />
          </td>
        </tr>
      ))}
      {openingExplorerMoves.length > 0 && (
        <tr>
          <td>
            <LuSigma />
          </td>
          <td>
            <LargeNumber num={positionStats.totalGames} />
          </td>
          <td>
            <WinPercentageBar
              whiteWinRate={calcPercentage(
                positionStats.white,
                positionStats.totalGames,
              )}
              drawRate={calcPercentage(
                positionStats.draws,
                positionStats.totalGames,
              )}
              blackWinRate={calcPercentage(
                positionStats.black,
                positionStats.totalGames,
              )}
            />
          </td>
        </tr>
      )}
    </>
  );
};
