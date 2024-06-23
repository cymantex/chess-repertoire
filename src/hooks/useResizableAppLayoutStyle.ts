import { CSSProperties, useLayoutEffect, useState } from "react";
import { APP_PADDING_REM, MARGIN, SIDEBAR_SIZE } from "@/defs.ts";
import { isMobileSize } from "@/utils/utils.ts";

const calcMaxScreenHeight = () =>
  window.screen.availHeight - (window.outerHeight - window.innerHeight);

const calcMaxSizeMargin = () => calcMaxScreenHeight() / 4;

const calcMainSize = () => {
  if (isMobileSize()) {
    return window.innerWidth - MARGIN;
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
      ? `${mainSize}px`
      : `calc(${size}px - ${APP_PADDING_REM}rem)`;

  return {
    // @ts-ignore
    "--cg-width": subtractAppPadding(mainSize),
    "--cg-height": subtractAppPadding(mainSize),
    gridTemplateColumns: `${subtractAppPadding(mainSize)} ${subtractAppPadding(SIDEBAR_SIZE)}`,
    maxWidth: `calc(${mainSize}px + ${SIDEBAR_SIZE}px + ${APP_PADDING_REM * 2}rem)`,
  };
};
