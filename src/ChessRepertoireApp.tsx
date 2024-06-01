import { Chessboard } from "@/chessboard/Chessboard.tsx";
import { useLayoutEffect, useState } from "react";
import { OpeningExplorer } from "@/opening-explorer/OpeningExplorer.tsx";
import { useChessRepertoireStore } from "@/store.ts";

const BREAKPOINT_SM = 640;
const SIDEBAR_SIZE = 400;
const APP_PADDING_REM = 0.75;

const isMobileSize = () => window.innerWidth <= BREAKPOINT_SM;
const calcMainSize = () =>
  isMobileSize() ? window.innerWidth : window.innerWidth - SIDEBAR_SIZE;

export const ChessRepertoireApp = () => {
  const { setFenIfValid, setPgnIfValid } = useChessRepertoireStore();
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
      className="chess-repertoire sm:grid"
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
        <label className="flex mt-3">
          <div className="label mr-3 pr-0">
            <span className="label-text">FEN</span>
          </div>
          <input
            type="text"
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            className="input input-bordered w-full"
            onChange={(e) => setFenIfValid(e.target.value)}
          />
        </label>
        <label className="flex mt-3">
          <div className="label mr-2 pr-0">
            <span className="label-text">PGN</span>
          </div>
          <textarea
            rows={3}
            className="textarea textarea-bordered w-full"
            onChange={(e) => setPgnIfValid(e.target.value)}
          />
        </label>
      </main>
      <aside className="pl-2.5">
        <div className="h-full w-full">
          <OpeningExplorer />
        </div>
      </aside>
    </div>
  );
};
