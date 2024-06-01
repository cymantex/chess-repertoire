import React, { useEffect, useRef } from "react";
import { Chessground as NativeChessground } from "chessground";
import { Config } from "chessground/config";

export interface ChessgroundProps extends Config {
  chessgroundDivProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Chessground = ({
  chessgroundDivProps,
  ...chessGroundConfig
}: ChessgroundProps) => {
  const chessGroundDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chessGroundDivRef?.current) return;

    const chessground = NativeChessground(
      chessGroundDivRef.current,
      chessGroundConfig,
    );

    return () => chessground.destroy();
  }, [chessGroundDivRef, chessGroundConfig]);

  return <div ref={chessGroundDivRef} {...chessgroundDivProps} />;
};
