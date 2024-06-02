import { expect, test } from "vitest";
import { ChildNode, parsePgn, PgnNodeData } from "chessops/pgn";
import { findCurrentMove } from "@/pgn/pgn.ts";

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

const createPgn = (pgn: string) => ({
  ...parsePgn(pgn)[0],
  fen: "fen",
});
