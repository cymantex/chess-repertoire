import { Chessboard } from "@/chessboard/Chessboard.tsx";
import { useLayoutEffect, useState } from "react";
import { OpeningExplorer } from "@/opening-explorer/OpeningExplorer.tsx";
import { FenInputField } from "@/import-export/FenInputField.tsx";
import { PgnInputField } from "@/import-export/PgnInputField.tsx";

const BREAKPOINT_MD = 768;
const SIDEBAR_SIZE = 500;
const APP_PADDING_REM = 0.75;

const isMobileSize = () => window.innerWidth <= BREAKPOINT_MD;

const calcMaxScreenHeight = () =>
  window.screen.availHeight - (window.outerHeight - window.innerHeight);

const calcMaxSizeMargin = () => calcMaxScreenHeight() / 5;

const calcMainSize = () => {
  if (isMobileSize()) {
    return window.innerWidth;
  }

  if (
    calcMaxScreenHeight() <
    window.innerWidth - (SIDEBAR_SIZE - calcMaxSizeMargin())
  ) {
    return window.innerHeight - calcMaxSizeMargin();
  }

  return window.innerWidth - SIDEBAR_SIZE;
};

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
    <div className="ml-auto mr-auto">
      <div
        className="chess-repertoire sm:grid ml-auto mr-auto"
        style={{
          // @ts-ignore
          "--cg-width": subtractAppPadding(mainSize),
          "--cg-height": subtractAppPadding(mainSize),
          padding: `${APP_PADDING_REM}rem`,
          gridTemplateColumns: `${subtractAppPadding(mainSize)} ${subtractAppPadding(SIDEBAR_SIZE)}`,
          maxWidth: `calc(${mainSize}px + ${SIDEBAR_SIZE}px + ${APP_PADDING_REM * 2}rem)`,
        }}
      >
        <main>
          <Chessboard />
          <FenInputField />
          <PgnInputField />
        </main>
        <aside className="pl-2.5">
          <div className="h-full w-full">
            <OpeningExplorer />
          </div>
        </aside>
      </div>
    </div>
  );
};
