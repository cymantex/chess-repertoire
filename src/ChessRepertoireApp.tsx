import { Chessboard } from "@/chessboard/Chessboard.tsx";
import { useLayoutEffect, useState } from "react";
import { OpeningExplorer } from "@/opening-explorer/OpeningExplorer.tsx";

const BREAKPOINT_SM = 640;
const SIDEBAR_SIZE = 400;
const APP_PADDING_REM = 0.75;

const isMobileSize = () => window.innerWidth <= BREAKPOINT_SM;
const calcMainSize = () =>
  isMobileSize() ? window.innerWidth : window.innerWidth - SIDEBAR_SIZE;

export const ChessRepertoireApp = () => {
  const [mainSize, setMainSize] = useState(calcMainSize());

  useLayoutEffect(() => {
    const handleResize = () => setMainSize(calcMainSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtractAppPadding = (size: number) =>
    isMobileSize()
      ? `calc(${mainSize}px - ${APP_PADDING_REM * 2}rem)`
      : `calc(${size}px - ${APP_PADDING_REM}rem)`;

  return (
    <div
      className="chess-repertoire sm:grid p-3"
      style={{
        // @ts-ignore
        "--cg-width": subtractAppPadding(mainSize),
        "--cg-height": subtractAppPadding(mainSize),
        padding: `${APP_PADDING_REM}rem`,
        gridTemplateColumns: `${subtractAppPadding(mainSize)} ${subtractAppPadding(SIDEBAR_SIZE)}`,
      }}
    >
      <main>
        <Chessboard />
      </main>
      <aside className="pl-2.5">
        <div className="h-full w-full">
          <OpeningExplorer />
        </div>
      </aside>
    </div>
  );
};
