import { OpeningExplorerMove } from "@/defs.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectCurrentRepertoirePositionMoves,
  selectFen,
  selectHandleOpeningExplorerMove,
  selectSetHoveredOpeningMove,
} from "@/stores/zustand/selectors.ts";
import {
  calcPercentage,
  calcPositionStats,
  prettifyLargeNumber,
  toOrderedRepertoireOpeningExplorerMoves,
} from "@/components/RepertoireSidebar/OpeningExplorer/utils.ts";
import { MoveAnnotationMenu } from "@/components/RepertoireSidebar/OpeningExplorer/MoveAnnotationMenu.tsx";
import { userSelectionExists } from "@/external/chessground/utils.ts";
import { MoveStats } from "@/components/RepertoireSidebar/OpeningExplorer/MoveStats.tsx";
import { Loader } from "@/components/reused/Loader.tsx";
import { FetchError } from "@/components/reused/FetchError.tsx";
import { useOpeningExplorerQuery } from "@/components/RepertoireSidebar/OpeningExplorer/useOpeningExplorerQuery.tsx";
import { LuSigma } from "react-icons/lu";
import { WinPercentageBar } from "@/components/RepertoireSidebar/OpeningExplorer/WinPercentageBar.tsx";

export const OpeningExplorerTbody = () => {
  const fen = useRepertoireStore(selectFen);
  const { isPending, error, data } = useOpeningExplorerQuery(fen);

  const chess = useRepertoireStore(selectChess);
  const setHoveredOpeningMove = useRepertoireStore(selectSetHoveredOpeningMove);
  const handleOpeningExplorerMove = useRepertoireStore(
    selectHandleOpeningExplorerMove,
  );
  const repertoireMoves =
    useRepertoireStore(selectCurrentRepertoirePositionMoves) ?? [];

  if (isPending)
    return (
      <tr>
        <td>
          <Loader />
        </td>
      </tr>
    );
  if (error)
    return (
      <tr>
        <td>
          <FetchError error={error} />
        </td>
      </tr>
    );

  const isRepertoireMove = (san: string) =>
    repertoireMoves?.some((move) => move.san === san);
  const openingExplorerMoves: OpeningExplorerMove[] = data.moves;
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
            !userSelectionExists() && setHoveredOpeningMove(move)
          }
          onMouseLeave={() =>
            !userSelectionExists() && setHoveredOpeningMove(null)
          }
        >
          <td className="font-chess">
            {isRepertoireMove(move.san) ? (
              <span className="text-accent font-bold">{move.san}</span>
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
          <td>{prettifyLargeNumber(positionStats.totalGames)}</td>
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
