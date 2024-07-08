import React, { useEffect, useRef } from "react";
import { Chessground as NativeChessground } from "chessground";
import { Config } from "chessground/config";
import { chessgroundMap } from "./utils.ts";

export interface ChessgroundProps extends Config {
  id: string;
  chessgroundDivProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Chessground = ({
  id,
  chessgroundDivProps,
  ...chessGroundConfig
}: ChessgroundProps) => {
  const chessGroundDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chessGroundDivRef?.current) return;

    chessgroundMap.set(
      id,
      NativeChessground(chessGroundDivRef.current, chessGroundConfig),
    );

    return () => {
      chessgroundMap.get(id)?.destroy();
      chessgroundMap.delete(id);
    };
  }, [id, chessGroundDivRef, chessGroundConfig]);

  return <div ref={chessGroundDivRef} {...chessgroundDivProps} />;
};
