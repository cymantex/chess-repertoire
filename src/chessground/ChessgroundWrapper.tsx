import { Chessground, ChessgroundProps } from "./Chessground.tsx";
import React, { useRef } from "react";

export interface ChessgroundWrapperProps extends ChessgroundProps {
  wrapperDivProps?: React.HTMLAttributes<HTMLDivElement>;
  children?: React.ReactNode;
}

/**
 * Wrapper around Chessground component that adds dimensions CSS variables to
 * a wrapper div. This can for example be useful if you need to exactly
 * position children elements on top of the chessboard.
 */
export const ChessgroundWrapper = ({
  wrapperDivProps,
  children,
  ...chessgroundProps
}: ChessgroundWrapperProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "var(---cg-width)",
        height: "var(---cg-height)",
        position: "relative",
      }}
      {...wrapperDivProps}
    >
      <Chessground
        addDimensionsCssVarsTo={wrapperRef.current!}
        {...chessgroundProps}
      />
      {children}
    </div>
  );
};
