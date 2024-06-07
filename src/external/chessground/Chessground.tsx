import React, { useEffect, useRef } from "react";
import { Chessground as NativeChessground } from "chessground";
import { Config } from "chessground/config";
import { Api } from "chessground/api";

export let chessground: Api | null = null;

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

    chessground = NativeChessground(
      chessGroundDivRef.current,
      chessGroundConfig,
    );

    return () => {
      chessground?.destroy();
      chessground = null;
    };
  }, [chessGroundDivRef, chessGroundConfig]);

  return <div ref={chessGroundDivRef} {...chessgroundDivProps} />;
};
