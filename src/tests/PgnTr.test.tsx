import { beforeEach, expect, test, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Chess } from "chess.js";
import { makePgn, parsePgn } from "chessops/pgn";
import type { ChessRepertoireStore } from "@/app/zustand/store.ts";
import type { PgnMoveData } from "@/external/chessops/defs.ts";
import { PgnTr } from "@/features/pgn/explorer/PgnTr.tsx";

const state = {
  pgn: parsePgn("*")[0],
  chess: new Chess(),
  fen: new Chess().fen(),
  pendingPromotionMove: null,
};

vi.mock("@/app/zustand/store.ts", () => ({
  useRepertoireStore: (selector: (store: typeof state) => unknown) =>
    selector(state),
  selectPgn: (store: ChessRepertoireStore) => store.pgn,
  selectChess: (store: ChessRepertoireStore) => store.chess,
  selectFen: (store: ChessRepertoireStore) => store.fen,
}));

vi.mock("@/features/chessboard/chessboardSlice.ts", () => ({
  selectPendingPromotionMove: (store: ChessRepertoireStore) =>
    store.pendingPromotionMove,
}));

vi.mock("@/features/pgn/explorer/PgnContextMenu.tsx", () => ({
  PgnContextMenu: () => null,
}));

vi.mock("@/common/components/GoToMoveButton.tsx", () => ({
  GoToMoveButton: ({
    move,
    getVariation,
    selected,
    disabled,
  }: {
    move: PgnMoveData;
    getVariation: (move: PgnMoveData) => string[];
    selected: boolean;
    disabled: boolean;
  }) => (
    <button
      data-variation={getVariation(move).join(" ")}
      data-selected={selected}
      disabled={disabled}
    >
      {move.moveNumber}
      {move.san}
    </button>
  ),
}));

beforeEach(() => {
  state.chess = new Chess();
  state.fen = state.chess.fen();
});

const render = (pgn: string) => {
  state.pgn = parsePgn(pgn)[0];
  return renderToStaticMarkup(<PgnTr />);
};

const moves = (html: string) =>
  Array.from(
    html.matchAll(/<button[^>]*>(.*?)<\/button>/g),
    ([, move]) => move,
  );

test("empty PGN has no row; a mainline has normal move numbers", () => {
  expect(render("*")).toBe("");
  expect(moves(render("1. e4 e5 2. Nf3 Nc6"))).toEqual([
    "1.e4",
    "e5",
    "2.Nf3",
    "Nc6",
  ]);
});

test("a lone short variation stays parenthetical and resumes the mainline", () => {
  const html = render("1. e4 (1. d4 d5) e5 2. Nf3");
  expect(html.match(/class="pgn-inline"/g)).toHaveLength(1);
  expect(html).not.toContain("pgn-branches");
  expect(moves(html)).toEqual(["1.e4", "1.d4", "d5", "1...e5", "2.Nf3"]);
});

test("siblings each get a line instead of adjacent parentheses", () => {
  const html = render("1. e4 (1. d4 d5) (1. c4 e5) e5");
  expect(html.match(/<li class="pgn-line"/g)).toHaveLength(2);
  expect(html).not.toContain("pgn-inline");
  expect(moves(html)).toEqual(["1.e4", "1.d4", "d5", "1.c4", "e5", "1...e5"]);
});

test("branching sidelines expand all their continuations into nested lines", () => {
  const html = render("1. e4 (1. d4 d5 (1... Nf6) (1... f5) 2. c4) e5");
  expect(html.match(/<ul class="pgn-branches"/g)).toHaveLength(2);
  expect(html.match(/<li class="pgn-line"/g)).toHaveLength(4);
  expect(html).not.toContain("pgn-inline");
  expect(moves(html)).toEqual([
    "1.e4",
    "1.d4",
    "1...d5",
    "2.c4",
    "1...Nf6",
    "1...f5",
    "1...e5",
  ]);
});

test("a nested simple variation expands its parent, avoiding nested parentheses", () => {
  const html = render("1. e4 (1. d4 d5 (1... Nf6) 2. c4) e5");
  expect(html.match(/<ul class="pgn-branches"/g)).toHaveLength(1);
  expect(html.match(/class="pgn-inline"/g)).toHaveLength(1);
  expect(moves(html)).toEqual([
    "1.e4",
    "1.d4",
    "d5",
    "1...Nf6",
    "2.c4",
    "1...e5",
  ]);
});

test("six-ply sidelines can be inline; longer ones get a line", () => {
  expect(render("1. e4 (1. d4 d5 2. c4 e6 3. Nc3 Nf6) e5")).toContain(
    'class="pgn-inline"',
  );
  const html = render("1. e4 (1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3) e5");
  expect(html).toContain("pgn-branches");
  expect(html).not.toContain("pgn-inline");
});

test("move numbering respects a black-to-move starting FEN", () => {
  const html = render(
    '[FEN "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 17"]\n\n' +
      "17... e5 (17... c5) 18. Nf3",
  );
  expect(moves(html)).toEqual(["17...e5", "17...c5", "18.Nf3"]);
});

test("navigation and selection identify the exact branch through transpositions", () => {
  const selectedPath = ["Nc3", "Nf6", "Nf3", "Nc6", "e4"];
  selectedPath.forEach((san) => state.chess.move(san));
  state.fen = state.chess.fen();
  const html = render(
    "1. Nf3 (1. Nc3 Nf6 2. Nf3 Nc6 3. e4) Nf6 2. Nc3 Nc6 3. e4",
  );
  expect(html.match(/data-selected="true"/g)).toHaveLength(1);
  expect(html).toContain(
    'data-variation="Nc3 Nf6 Nf3 Nc6 e4" data-selected="true"',
  );
  expect(html).toContain(
    'data-variation="Nf3 Nf6 Nc3 Nc6 e4" data-selected="false"',
  );
});

test("rendering does not alter the stored PGN or discard its annotations", () => {
  state.pgn = parsePgn("1. e4! {A comment} e5 2. Bh6")[0];
  const originalMoves = state.pgn.moves;
  const originalPgn = makePgn(state.pgn);
  const html = renderToStaticMarkup(<PgnTr />);
  expect(moves(html)).toEqual(["1.e4", "e5"]);
  expect(state.pgn.moves).toBe(originalMoves);
  expect(makePgn(state.pgn)).toBe(originalPgn);
});
