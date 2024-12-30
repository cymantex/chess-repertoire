import { expect, test } from "vitest";
import { ChildNode, parsePgn, PgnNodeData } from "chessops/pgn";
import {
  findCurrentMove,
  getRemainingMainMoves,
} from "../external/chessops/pgn.ts";
import { parseVariation } from "@/features/pgn/utils.ts";

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

test("getRemainingMainMoves", () => {
  // Arrange
  const pgn = createPgn("1. e4 e5 2. Nf3 Nc6 3. Bb5 a6");

  // Act
  const remainingVariation = getRemainingMainMoves(pgn, ["e4", "e5", "Nf3"]);

  // Assert
  expect(remainingVariation).toEqual(["Nc6", "Bb5", "a6"]);
});

test("parseVariation", () => {
  expect(parseVariation([])).toEqual([]);

  expect(parseVariation("1. e4 e5 2. Nf3 Nc6".split(" "))).toEqual([
    { san: "e4", moveNumber: "1.", id: 0 },
    { san: "e5", id: 1 },
    { san: "Nf3", moveNumber: "2.", id: 2 },
    { san: "Nc6", id: 3 },
  ]);

  expect(parseVariation("1... e5 2. Nf3".split(" "))).toEqual([
    { san: "e5", moveNumber: "1...", id: 0 },
    { san: "Nf3", moveNumber: "2.", id: 1 },
  ]);

  expect(parseVariation("1... e5 2. Nf3 3.".split(" "))).toEqual([
    { san: "e5", moveNumber: "1...", id: 0 },
    { san: "Nf3", moveNumber: "2.", id: 1 },
  ]);
});

const createPgn = (pgn: string) => ({
  ...parsePgn(pgn)[0],
  fen: "fen",
});
