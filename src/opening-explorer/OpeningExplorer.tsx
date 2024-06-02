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
import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";

export const OpeningExplorer = () => {
  const {
    fen,
    rotate,
    handleOpeningExplorerMove,
    goToFirstMove,
    goToPreviousMove,
    goToNextMove,
    goToLastMove,
    setHoveredOpeningMove,
  } = useChessRepertoireStore();
  const { isPending, error, openingExplorerResponse, cloudEvaluationResponse } =
    useOpeningExplorerQuery(fen);

  if (isPending)
    return <span className="loading loading-dots loading-lg"></span>;

  if (error) return "An error has occurred: " + error.message;

  const calcTotalGames = (move: OpeningExplorerMove) =>
    move.black + move.white + move.draws;

  const cpDisplayValue = (cp: number) => (
    <span className="font-bold">
      {cp < 0 ? `-0.${Math.abs(cp)}` : `+0.${cp}`}
    </span>
  );

  const chessopsPosition = parsePosition(fen);

  return (
    <div className="opening-explorer">
      <div className="overflow-x-auto mb-3">
        <table className="table table-sm">
          <thead>
            <tr>
              <td>Cloud engine evaluation</td>
            </tr>
          </thead>
          <tbody>
            {cloudEvaluationResponse.pvs?.map((pv) => (
              <tr className="hover cursor-pointer" key={pv.moves}>
                <td className="whitespace-nowrap">
                  {cpDisplayValue(pv.cp)}{" "}
                  {uciMovesToSan(chessopsPosition, pv.moves)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <table className="table table-sm table-zebra">
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
              onMouseEnter={() => setHoveredOpeningMove(move)}
              onMouseLeave={() => setHoveredOpeningMove(null)}
            >
              <td>{move.san}</td>
              <td>{calcTotalGames(move)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="opening-explorer__navigation flex justify-evenly text-2xl pt-3">
        <FaRotate className="cursor-pointer" onClick={rotate} />
        <FaFastBackward className="cursor-pointer" onClick={goToFirstMove} />
        <FaStepBackward className="cursor-pointer" onClick={goToPreviousMove} />
        <FaStepForward className="cursor-pointer" onClick={goToNextMove} />
        <FaFastForward className="cursor-pointer" onClick={goToLastMove} />
      </div>
    </div>
  );
};
