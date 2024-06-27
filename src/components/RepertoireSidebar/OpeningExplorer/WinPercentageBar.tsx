export const WinPercentageBar = ({
  blackWinRate,
  drawRate,
  whiteWinRate,
}: {
  whiteWinRate: number;
  drawRate: number;
  blackWinRate: number;
}) => (
  <div className="flex rounded w-52 rounded overflow-hidden font-light text-xs items-center text-center">
    <div
      className="leading-none p-1"
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        width: `${whiteWinRate.toFixed(0)}%`,
        color: "black",
      }}
    >
      {whiteWinRate.toFixed(0)}%
    </div>
    <span
      className="leading-none p-1"
      style={{
        backgroundColor: "rgb(100, 100, 100)",
        width: `${drawRate.toFixed(0)}%`,
        color: "white",
      }}
    >
      {drawRate.toFixed(0)}%
    </span>
    <span
      className="leading-none p-1"
      style={{
        backgroundColor: "rgb(35, 35, 35)",
        width: `${blackWinRate.toFixed(0)}%`,
        color: "white",
      }}
    >
      {blackWinRate.toFixed(0)}%
    </span>
  </div>
);
