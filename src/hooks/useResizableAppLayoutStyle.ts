import { CSSProperties, useLayoutEffect, useState } from "react";

const BREAKPOINT_MD = 768;
const SIDEBAR_SIZE = 500;
const MARGIN = 10; // Additional space to allow for scrollbars
const APP_PADDING_REM = 0.75;

const isMobileSize = () => window.innerWidth <= BREAKPOINT_MD;

const calcMaxScreenHeight = () =>
  window.screen.availHeight - (window.outerHeight - window.innerHeight);

const calcMaxSizeMargin = () => calcMaxScreenHeight() / 4;

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

  return window.innerWidth - SIDEBAR_SIZE - MARGIN;
};

export const useResizableAppLayoutStyle = (): CSSProperties => {
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

  return {
    // @ts-ignore
    "--cg-width": subtractAppPadding(mainSize),
    "--cg-height": subtractAppPadding(mainSize),
    padding: `${APP_PADDING_REM}rem`,
    gridTemplateColumns: `${subtractAppPadding(mainSize)} ${subtractAppPadding(SIDEBAR_SIZE)}`,
    maxWidth: `calc(${mainSize}px + ${SIDEBAR_SIZE}px + ${APP_PADDING_REM * 2}rem)`,
  };
};
