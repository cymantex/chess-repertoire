import "./OpeningExplorer.scss";
import { useQuery } from "@tanstack/react-query";
import { useChessRepertoireStore } from "@/store.ts";

export interface OpeningExplorerMove {
  averageRating: number;
  black: number;
  draws: number;
  san: string;
  white: number;
}

interface OpeningExplorerResponse {
  black: number;
  draws: number;
  opening: string;
  white: number;
  moves: OpeningExplorerMove[];
}

export const OpeningExplorer = () => {
  const { fen, handleOpeningExplorerMove } = useChessRepertoireStore();
  const { isPending, error, data } = useQuery<OpeningExplorerResponse>({
    queryKey: [fen],
    queryFn: () =>
      fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const calcTotalGames = (move: OpeningExplorerMove) =>
    move.black + move.white + move.draws;

  return (
    <div className="cy-opening-explorer">
      <table className="table table-zebra">
        <thead>
          <tr>
            <td>Move</td>
            <td>Games</td>
          </tr>
        </thead>
        <tbody>
          {data.moves.map((move) => (
            <tr
              className="hover cursor-pointer"
              key={move.san}
              onClick={() => handleOpeningExplorerMove(move)}
            >
              <td>{move.san}</td>
              <td>{calcTotalGames(move)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
