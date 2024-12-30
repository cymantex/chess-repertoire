import type { ChessgroundProps } from "./Chessground.tsx";
import { Chessground } from "./Chessground.tsx";
import type React from "react";
import { useRef } from "react";

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
    <div className="relative" ref={wrapperRef} {...wrapperDivProps}>
      <Chessground
        addDimensionsCssVarsTo={wrapperRef.current!}
        {...chessgroundProps}
      />
      {children}
    </div>
  );
};
