import { parseFen } from "chessops/fen";
import { Chess, parseUci, Position } from "chessops";
import { makeSanVariation } from "chessops/san";
import { Move } from "chessops/types";
import { takeWhile } from "lodash";

export const uciMovesToSan = (position: Position, uciMoves: string) => {
  return makeSanVariation(
    position,
    takeWhile(uciMoves.split(" ").map(parseUci)) as Move[],
  );
};

export const parsePosition = (fen: string): Position => {
  const setup = parseFen(fen).unwrap();
  return Chess.fromSetup(setup).unwrap();
};
