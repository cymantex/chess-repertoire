import { selectChess, useRepertoireStore } from "@/app/zustand/store.ts";
import {
  calcPercentage,
  calcPositionStats,
  toOrderedRepertoireOpeningExplorerMoves,
} from "@/features/opening-explorer/utils.ts";
import { MoveAnnotationMenu } from "@/features/opening-explorer/components/MoveAnnotationMenu.tsx";
import { userSelectionExists } from "@/external/chessground/utils.ts";
import { MoveStats } from "@/features/opening-explorer/stats/MoveStats.tsx";
import { LuSigma } from "react-icons/lu";
import { WinPercentageBar } from "@/features/opening-explorer/stats/WinPercentageBar.tsx";
import { LargeNumber } from "@/features/opening-explorer/components/LargeNumber.tsx";
import { CG_ID } from "@/features/chessboard/utils.ts";
import {
  selectHandleOpeningExplorerMove,
  selectSetHoveredOpeningMove,
} from "@/features/opening-explorer/openingExplorerSlice.ts";
import { selectCurrentRepertoirePositionMoves } from "@/features/repertoire/repertoireSlice.ts";
import type { OpeningExplorerMove } from "@/features/opening-explorer/defs.ts";

interface Props {
  openingExplorerMoves?: OpeningExplorerMove[];
}

export const OpeningExplorerTbody = ({ openingExplorerMoves = [] }: Props) => {
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
