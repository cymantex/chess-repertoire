import { parseFen } from "chessops/fen";
import type { Position } from "chessops";
import { Chess, parseUci } from "chessops";
import { makeSanVariation } from "chessops/san";
import type { Move } from "chessops/types";

export const uciMovesToSan = (position: Position, uciMoves: string) => {
  return makeSanVariation(
    position,
    uciMoves.split(" ").map(parseUci) as Move[],
  );
};

export const parsePosition = (fen: string): Position => {
  const setup = parseFen(fen).unwrap();
  return Chess.fromSetup(setup).unwrap();
};
