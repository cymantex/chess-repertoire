import { useChessRepertoireStore } from "@/store/store.ts";
import {
  OpeningExplorerMove,
  OpeningExplorerResponse,
} from "@/components/RepertoireSidebar/components/types.ts";
import { getRepertoireMoves } from "@/repertoire-database/repertoireDatabase.ts";
import { useQuery } from "@tanstack/react-query";
import { MovePriorityMenu } from "@/components/RepertoireSidebar/components/MovePriorityMenu.tsx";
import { Loader } from "@/components/RepertoireSidebar/components/Loader.tsx";
import { FetchError } from "@/components/RepertoireSidebar/components/FetchError.tsx";
import {
  selectFen,
  selectHandleOpeningExplorerMove,
  selectSetHoveredOpeningMove,
} from "@/store/selectors.ts";

export const OpeningExplorer = () => {
  const fen = useChessRepertoireStore(selectFen);
  const setHoveredOpeningMove = useChessRepertoireStore(
    selectSetHoveredOpeningMove,
  );
  const handleOpeningExplorerMove = useChessRepertoireStore(
    selectHandleOpeningExplorerMove,
  );
  const { isPending, error, data } = useQuery<OpeningExplorerResponse>({
    queryKey: [`opening-explorer-${fen}`],
    queryFn: () =>
      fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

  if (isPending) return <Loader />;
  if (error) return <FetchError error={error} />;

  const calcTotalGames = (move: OpeningExplorerMove) =>
    move.black + move.white + move.draws;

  const repertoireMoves = getRepertoireMoves(fen);

  const isRepertoireMove = (san: string) =>
    repertoireMoves?.some((move) => move.san === san);

  return (
    <table className="table table-sm table-zebra select-none">
      <thead>
        <tr>
          <td>Move</td>
          <td>Games</td>
          <td>Priority</td>
        </tr>
      </thead>
      <tbody>
        {data.moves.map((move) => (
          <tr
            className="hover cursor-pointer"
            key={move.san}
            onClick={() => handleOpeningExplorerMove(move)}
            onMouseEnter={() => setHoveredOpeningMove(move)}
            onMouseLeave={() => setHoveredOpeningMove(null)}
          >
            <td>
              {isRepertoireMove(move.san) ? (
                <span className="font-bold">{move.san}</span>
              ) : (
                move.san
              )}
            </td>
            <td>{calcTotalGames(move)}</td>
            <td>
              <MovePriorityMenu />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
