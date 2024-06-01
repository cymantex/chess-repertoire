import { useChessRepertoireStore } from "@/store.ts";
import {
  FaFastBackward,
  FaFastForward,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useOpeningExplorerQuery } from "@/opening-explorer/useOpeningExplorerQuery.tsx";
import { OpeningExplorerMove } from "@/opening-explorer/types.ts";
import { FaRotate } from "react-icons/fa6";

export const OpeningExplorer = () => {
  const {
    fen,
    handleRotate,
    handleOpeningExplorerMove,
    handleUndoLastMove,
    setHoveredMove,
  } = useChessRepertoireStore();
  const { isPending, error, openingExplorerResponse } =
    useOpeningExplorerQuery(fen);

  if (isPending)
    return <span className="loading loading-dots loading-lg"></span>;

  if (error) return "An error has occurred: " + error.message;

  const calcTotalGames = (move: OpeningExplorerMove) =>
    move.black + move.white + move.draws;

  return (
    <div className="opening-explorer">
      <table className="table table-zebra">
        <thead>
          <tr>
            <td>Move</td>
            <td>Games</td>
          </tr>
        </thead>
        <tbody>
          {openingExplorerResponse.moves.map((move) => (
            <tr
              className="hover cursor-pointer"
              key={move.san}
              onClick={() => handleOpeningExplorerMove(move)}
              onMouseEnter={() => setHoveredMove(move)}
              onMouseLeave={() => setHoveredMove(null)}
            >
              <td>{move.san}</td>
              <td>{calcTotalGames(move)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="opening-explorer__navigation flex justify-evenly text-2xl pt-3">
        <FaRotate className="cursor-pointer" onClick={handleRotate} />
        <FaFastBackward className="cursor-pointer" />
        <FaStepBackward
          className="cursor-pointer"
          onClick={handleUndoLastMove}
        />
        <FaStepForward className="cursor-pointer" />
        <FaFastForward className="cursor-pointer" />
      </div>
    </div>
  );
};
