import { RepertoireOpeningExplorerMove } from "@/features/repertoire/defs.ts";
import {
  calcPercentage,
  isOpeningExplorerMove,
} from "@/features/opening-explorer/utils.ts";
import { PieChart } from "react-minimal-pie-chart";
import { WinPercentageBar } from "@/features/opening-explorer/stats/WinPercentageBar.tsx";
import { LargeNumber } from "@/features/opening-explorer/components/LargeNumber.tsx";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";

interface Props {
  totalGamesForPosition: number;
  move: RepertoireOpeningExplorerMove;
}

export const MoveStats = ({ totalGamesForPosition, move }: Props) => {
  if (!isOpeningExplorerMove(move)) return null;

  const totalGamesForMove = move.white + move.draws + move.black;
  const gamesPercentage = calcPercentage(
    totalGamesForMove,
    totalGamesForPosition,
  );
  const whiteWinRate = calcPercentage(move.white, totalGamesForMove);
  const drawRate = calcPercentage(move.draws, totalGamesForMove);
  const blackWinRate = calcPercentage(move.black, totalGamesForMove);

  return (
    <Tooltip
      align="right"
      renderTooltip={() => (
        <>
          <div className="text-xs font-light mb-2">
            Total games: <LargeNumber num={totalGamesForMove} />
          </div>
          <WinPercentageBar
            whiteWinRate={whiteWinRate}
            drawRate={drawRate}
            blackWinRate={blackWinRate}
          />
        </>
      )}
    >
      <div className="flex gap-2 justify-between items-center">
        <span title={`${totalGamesForMove} games`}>
          {gamesPercentage.toFixed(0)}%
        </span>
        <PieChart
          style={{
            width: "22px",
          }}
          data={[
            {
              title: `Draw: ${drawRate.toFixed(2)}%`,
              value: drawRate,
              color: "rgb(150, 150, 150)",
            },
            {
              title: `White: ${whiteWinRate.toFixed(2)}%`,
              value: whiteWinRate,
              color: "rgb(255, 255, 255)",
            },
            {
              title: `Black: ${blackWinRate.toFixed(2)}%`,
              value: blackWinRate,
              color: "rgb(35, 35, 35)",
            },
          ]}
        />
      </div>
    </Tooltip>
  );
};
