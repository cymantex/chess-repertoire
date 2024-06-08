import { expect, test } from "vitest";
import {
  FEN_STARTING_POSITION,
  REPERTOIRE_MOVE_PRIORITY,
  RepertoirePositionData,
} from "@/defs.ts";
import { generateChessLines } from "@/utils/generateChessLines.ts";
import { toPgn } from "@/external/chessjs/utils.ts";

const FEN_E4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
const FEN_SICILIAN =
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";
const FEN_SICILIAN_NF3 =
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";
const expectedHeader = `[Result "*"]\n\n`;

const toPgnList = (repertoire: Record<string, RepertoirePositionData>) => {
  return Array.from(
    generateChessLines({
      getRepertoirePositionData: (fen) => repertoire[fen] ?? null,
      position: repertoire[FEN_STARTING_POSITION],
      previousMoves: [],
    }),
  ).map(toPgn);
};

test("No starting position", () => {
  expect(toPgnList({ FEN_E4: { moves: [{ san: "e5" }] } })).toEqual([]);
});

test("Multiple starting moves", () => {
  expect(
    toPgnList({
      [FEN_STARTING_POSITION]: {
        moves: [{ san: "e4" }, { san: "c4" }],
      },
    }),
  ).toEqual([expectedHeader + "1. e4 *", expectedHeader + "1. c4 *"]);
});

test("Multiple lines with comments and priority", () => {
  expect(
    toPgnList({
      [FEN_STARTING_POSITION]: {
        moves: [
          { san: "e4", priority: REPERTOIRE_MOVE_PRIORITY.KING },
          { san: "c4" },
        ],
        comment: "starting position",
      },
      [FEN_E4]: {
        moves: [{ san: "e5" }, { san: "c5" }],
        comment: "king's pawn",
      },
      [FEN_SICILIAN]: {
        moves: [
          { san: "Nf3", priority: REPERTOIRE_MOVE_PRIORITY.QUEEN },
          { san: "Nc3", priority: REPERTOIRE_MOVE_PRIORITY.PAWN },
        ],
        comment: "sicilian",
      },
      [FEN_SICILIAN_NF3]: {
        moves: [],
        comment: "sicilian Nf3",
      },
    }),
  ).toEqual([
    expectedHeader + "{starting position} 1. e4 {king's pawn__PRIORITY:0} e5 *",
    expectedHeader +
      "{starting position} 1. e4 {king's pawn__PRIORITY:0} c5 {sicilian} 2. Nf3 {sicilian Nf3__PRIORITY:1} *",
    expectedHeader +
      "{starting position} 1. e4 {king's pawn__PRIORITY:0} c5 {sicilian} 2. Nc3 {__PRIORITY:4} *",
    expectedHeader + "{starting position} 1. c4 *",
  ]);
});
