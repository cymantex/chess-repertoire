import type { CSSProperties } from "react";
import { useLayoutEffect, useState } from "react";
import { APP_PADDING_REM, MARGIN } from "@/app/defs.ts";
import { isMobileSize } from "@/common/utils/utils.ts";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import { selectSidebarSize } from "@/features/sidebar/sidebarSlice.ts";

const calcMaxScreenHeight = () =>
  window.screen.availHeight - (window.outerHeight - window.innerHeight);

const calcMaxSizeMargin = () => calcMaxScreenHeight() / 4;

const calcMainSize = (sidebarSize: number) => {
  if (isMobileSize()) {
    return window.innerWidth - MARGIN;
  }

  if (
    calcMaxScreenHeight() <
    window.innerWidth - (sidebarSize - calcMaxSizeMargin())
  ) {
    return window.innerHeight - calcMaxSizeMargin();
  }

  return window.innerWidth - sidebarSize - MARGIN;
};

export const useResizableAppLayoutStyle = (): CSSProperties => {
  const sidebarSize = useRepertoireStore(selectSidebarSize);
  const [mainSize, setMainSize] = useState(calcMainSize(sidebarSize));

  if (calcMainSize(sidebarSize) !== mainSize) {
    setMainSize(calcMainSize(sidebarSize));
  }

  useLayoutEffect(() => {
    const handleResize = () => setMainSize(calcMainSize(sidebarSize));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarSize]);

  const subtractAppPadding = (size: number) =>
    isMobileSize()
      ? `${mainSize}px`
      : `calc(${size}px - ${APP_PADDING_REM}rem)`;

  return {
    // @ts-expect-error
    "--cg-width": subtractAppPadding(mainSize),
    "--cg-height": subtractAppPadding(mainSize),
    "--app-padding": `${APP_PADDING_REM}rem`,
    gridTemplateColumns: `${subtractAppPadding(mainSize)} ${subtractAppPadding(sidebarSize)}`,
    maxWidth: `calc(${mainSize}px + ${sidebarSize}px + ${APP_PADDING_REM * 2}rem)`,
  };
};
