import { RepertoireOpeningExplorerMove } from "@/repertoire/defs.ts";
import { isOpeningExplorerMove } from "@/components/RepertoireSidebar/OpeningExplorer/utils.ts";
import { PieChart } from "react-minimal-pie-chart";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";
import { WinPercentageBar } from "@/components/RepertoireSidebar/OpeningExplorer/WinPercentageBar.tsx";

interface MoveStatsProps {
  totalGamesForPosition: number;
  move: RepertoireOpeningExplorerMove;
}

export const MoveStats = ({ totalGamesForPosition, move }: MoveStatsProps) => {
  if (!isOpeningExplorerMove(move)) return null;

  const totalGamesForMove = move.white + move.draws + move.black;
  const gamesPercentage = (totalGamesForMove / totalGamesForPosition) * 100;
  const whiteWinRate = (move.white / totalGamesForMove) * 100;
  const drawRate = (move.draws / totalGamesForMove) * 100;
  const blackWinRate = (move.black / totalGamesForMove) * 100;

  return (
    <Tooltip
      tooltip={
        <>
          <div className="text-xs font-light mb-2">
            Total games: {totalGamesForMove}
          </div>
          <WinPercentageBar
            whiteWinRate={whiteWinRate}
            drawRate={drawRate}
            blackWinRate={blackWinRate}
          />
        </>
      }
    >
      <div className="flex gap-2 justify-between items-center">
        <span className="hover:scale-110" title={`${totalGamesForMove} games`}>
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
