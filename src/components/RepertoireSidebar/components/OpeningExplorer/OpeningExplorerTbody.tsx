import { OpeningExplorerMove, OpeningExplorerResponse } from "@/defs.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectCurrentRepertoirePositionMoves,
  selectFen,
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
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/reused/Loader.tsx";
import { FetchError } from "@/components/reused/FetchError.tsx";

export const OpeningExplorerTbody = () => {
  const fen = useRepertoireStore(selectFen);
  const { isPending, error, data } = useQuery<OpeningExplorerResponse>({
    queryKey: [`opening-explorer-${fen}`],
    queryFn: () =>
      fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

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