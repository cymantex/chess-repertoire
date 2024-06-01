import { CjChessground } from "@/chessjs-chessground/CjChessground.tsx";
import { useLayoutEffect, useState } from "react";

const BREAKPOINT_SM = 640;
const SIDEBAR_SIZE = 300;
const MAIN_PADDING_REM = 0.75;

const isMobileSize = () => window.innerWidth <= BREAKPOINT_SM;
const calcMainSize = () =>
  isMobileSize() ? window.innerWidth : window.innerWidth - SIDEBAR_SIZE;

export const RepertoireApp = () => {
  const [mainSize, setMainSize] = useState(calcMainSize());

  useLayoutEffect(() => {
    const handleResize = () => setMainSize(calcMainSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCssCalc = (size: number) =>
    isMobileSize()
      ? `calc(${mainSize}px - ${MAIN_PADDING_REM * 2}rem)`
      : `calc(${size}px - ${MAIN_PADDING_REM}rem)`;

  return (
    <div
      className="chess-repertoire sm:grid p-3"
      style={{
        // @ts-ignore
        "--cg-width": getCssCalc(mainSize),
        "--cg-height": getCssCalc(mainSize),
        padding: `${MAIN_PADDING_REM}rem`,
        gridTemplateColumns: `${getCssCalc(mainSize)} ${getCssCalc(SIDEBAR_SIZE)}`,
      }}
    >
      <main>
        <CjChessground />
      </main>
      <aside className="pl-2.5">
        <div className="bg-amber-400 h-full w-full"></div>
      </aside>
    </div>
  );
};
