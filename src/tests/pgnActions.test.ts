import { expect, test } from "vitest";
import { makePgn, parsePgn } from "chessops/pgn";
import {
  getPgnPath,
  makePgnLine,
  updatePgnTree,
} from "@/features/pgn/explorer/pgnActions.ts";

const game = (pgn: string) => parsePgn(pgn)[0];

test("promotion changes the nearest branch while preserving its outer variation", () => {
  const original = game(
    "1. e4 (1. d4! {Keep this} d5 (1... Nf6 2. c4) 2. Nf3) e5",
  );
  const before = makePgn(original);
  const promoted = updatePgnTree(original, ["d4", "Nf6", "c4"], "promote");

  expect(Array.from(promoted.moves.mainline(), (move) => move.san)).toEqual([
    "e4",
    "e5",
  ]);
  const [d4] = getPgnPath(promoted, ["d4"]);
  expect(d4.children.map((node) => node.data.san)).toEqual(["Nf6", "d5"]);
  expect(d4.data.comments).toEqual(["Keep this"]);
  expect(d4.data.nags).toEqual([1]);
  expect(makePgn(original)).toBe(before);
});

test("make main line promotes every ancestor and retains the former main line", () => {
  const original = game("1. e4 (1. d4 d5 (1... Nf6 2. c4)) e5 2. Nf3");
  const promoted = updatePgnTree(original, ["d4", "Nf6", "c4"], "mainline");

  expect(Array.from(promoted.moves.mainline(), (move) => move.san)).toEqual([
    "d4",
    "Nf6",
    "c4",
  ]);
  expect(promoted.moves.children.map((node) => node.data.san)).toEqual([
    "d4",
    "e4",
  ]);
  expect(getPgnPath(promoted, ["e4", "e5", "Nf3"])).toHaveLength(3);
  expect(getPgnPath(promoted, ["d4", "d5"])).toHaveLength(2);
});

test("promoting a later sibling moves it ahead of all its siblings", () => {
  const promoted = updatePgnTree(
    game("1. e4 (1. d4 d5) (1. c4 e5) e5"),
    ["c4", "e5"],
    "promote",
  );
  expect(promoted.moves.children.map((node) => node.data.san)).toEqual([
    "c4",
    "e4",
    "d4",
  ]);
});

test("deletion removes the selected move and descendants, preserving siblings", () => {
  const original = game("1. e4 e5 (1... c5 2. Nf3 (2. Nc3) d6) 2. Nf3");
  const before = makePgn(original);
  const edited = updatePgnTree(original, ["e4", "c5"], "delete");

  expect(
    getPgnPath(edited, ["e4"])[0].children.map((node) => node.data.san),
  ).toEqual(["e5"]);
  expect(getPgnPath(edited, ["e4", "e5", "Nf3"])).toHaveLength(3);
  expect(makePgn(edited)).not.toContain("Nc3");
  expect(makePgn(original)).toBe(before);
});

test("deletion can remove the final root move", () => {
  const edited = updatePgnTree(game("1. e4 e5"), ["e4"], "delete");
  expect(edited.moves.children).toEqual([]);
});

test("deleting through a transposition leaves the other path intact", () => {
  const edited = updatePgnTree(
    game("1. Nf3 (1. Nc3 Nf6 2. Nf3 Nc6 3. e4) Nf6 2. Nc3 Nc6 3. e4"),
    ["Nc3", "Nf6", "Nf3", "Nc6"],
    "delete",
  );
  expect(getPgnPath(edited, ["Nf3", "Nf6", "Nc3", "Nc6", "e4"])).toHaveLength(
    5,
  );
  expect(getPgnPath(edited, ["Nc3", "Nf6", "Nf3"]).at(-1)?.children).toEqual(
    [],
  );
});

test("invalid and empty action paths cannot change the source PGN", () => {
  const original = game("1. e4 e5");
  const before = makePgn(original);
  expect(() => updatePgnTree(original, [], "delete")).toThrow();
  expect(() => updatePgnTree(original, ["e4", "c5"], "mainline")).toThrow();
  expect(makePgn(original)).toBe(before);
});

test("actions resolve the normalized SAN shown in the move list", () => {
  const original = game("1. e4 e5");
  original.moves.children[0].data.san = "e2e4";
  const edited = updatePgnTree(original, ["e4", "e5"], "delete");
  expect(edited.moves.children[0].children).toEqual([]);
  expect(original.moves.children[0].children).toHaveLength(1);
});

test("copying a main line includes its continuation without sidelines", () => {
  const original = game("1. e4! {Comment} (1. d4 d5) e5 (1... c5) 2. Nf3");
  const copied = game(makePgnLine(original, ["e4"]));
  expect(Array.from(copied.moves.mainline(), (move) => move.san)).toEqual([
    "e4",
    "e5",
    "Nf3",
  ]);
  expect(copied.moves.children).toHaveLength(1);
  expect(copied.moves.children[0].children).toHaveLength(1);
  expect(copied.moves.children[0].data.comments).toEqual(["Comment"]);
  expect(copied.moves.children[0].data.nags).toEqual([1]);
});

test("copying a variation keeps its lead-in and nested variations", () => {
  const original = game("1. e4 e5 (1... c5 2. Nf3 (2. Nc3) d6) 2. Bc4");
  const before = makePgn(original);
  const copied = game(makePgnLine(original, ["e4", "c5"]));
  expect(Array.from(copied.moves.mainline(), (move) => move.san)).toEqual([
    "e4",
    "c5",
    "Nf3",
    "d6",
  ]);
  expect(
    getPgnPath(copied, ["e4", "c5"])[1].children.map((node) => node.data.san),
  ).toEqual(["Nf3", "Nc3"]);
  expect(makePgn(copied)).not.toContain("Bc4");
  expect(makePgn(original)).toBe(before);
});

test("copying a variation preserves its custom starting FEN and numbering", () => {
  const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 17";
  const original = game(`[FEN "${fen}"]\n\n17... e5 (17... c5 18. Nf3)`);
  const copied = makePgnLine(original, ["c5"]);
  expect(copied).toContain(`[FEN "${fen}"]`);
  expect(copied).toContain("17... c5 18. Nf3");
});
