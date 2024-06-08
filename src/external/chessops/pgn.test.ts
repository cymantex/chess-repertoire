import { expect, test } from "vitest";
import { ChildNode, parsePgn, PgnNodeData } from "chessops/pgn";
import {
  findCurrentMove,
  getRemainingMainMoves,
} from "@/external/chessops/pgn.ts";

test("findCurrentMove", () => {
  // Arrange
  const pgn = createPgn("1. e4 e5 2. Nf3 (2. Nc3 Nc6 (2... Nf6)) Nc6");

  // Act
  const currentMove = findCurrentMove(pgn, [
    "e4",
    "e5",
    "Nc3",
    "Nf6",
  ])! as ChildNode<PgnNodeData>;

  // Assert
  expect(currentMove!.data.san).toEqual("Nf6");
});

test("getRemainingVariation", () => {
  // Arrange
  const pgn = createPgn("1. e4 e5 2. Nf3 Nc6 3. Bb5 a6");

  // Act
  const remainingVariation = getRemainingMainMoves(pgn, ["e4", "e5", "Nf3"]);

  // Assert
  expect(remainingVariation).toEqual(["Nc6", "Bb5", "a6"]);
});

const createPgn = (pgn: string) => ({
  ...parsePgn(pgn)[0],
  fen: "fen",
});
