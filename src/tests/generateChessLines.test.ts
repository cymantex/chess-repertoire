import { expect, test } from "vitest";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import {
  generateChessLines,
  GetRepertoirePosition,
} from "@/pgn/export/generateChessLines.ts";
import { getAnnotation } from "@/assets/annotation/defs.ts";
import { DrawShape } from "chessground/draw";
import { toPgn } from "@/pgn/utils.ts";
import { FEN_E4, FEN_SICILIAN, FEN_SICILIAN_NF3 } from "@/tests/testUtils.ts";
import {
  REPERTOIRE_ANNOTATION,
  RepertoirePosition,
} from "@/repertoire/defs.ts";

const resultHeader = `[Result "*"]\n\n`;

const toPgnList = async (repertoire: Record<string, RepertoirePosition>) => {
  const pgnList = [];
  const getRepertoirePosition: GetRepertoirePosition = (fen) =>
    Promise.resolve(repertoire[fen]);
  const generator = generateChessLines({
    getRepertoirePosition,
    position: repertoire[FEN_STARTING_POSITION],
    previousMoves: [],
  });

  for await (const chess of generator) {
    pgnList.push(toPgn(chess));
  }

  return pgnList;
};

test("No starting position", async () => {
  expect(await toPgnList({ [FEN_E4]: { moves: [{ san: "e5" }] } })).toEqual([]);
});

test("Multiple starting moves", async () => {
  expect(
    await toPgnList({
      [FEN_STARTING_POSITION]: {
        moves: [{ san: "e4" }, { san: "c4" }],
      },
    }),
  ).toEqual([resultHeader + "1. e4 *", resultHeader + "1. c4 *"]);
});

test("Multiple lines with comments, annotations and shapes", async () => {
  const shapes: DrawShape[] = [{ orig: "g1" }];
  const e4Annotation = getAnnotation(REPERTOIRE_ANNOTATION.BRILLIANT);
  const nf3Annotation = getAnnotation(REPERTOIRE_ANNOTATION.NEUTRAL);
  const nc3Annotation = getAnnotation(REPERTOIRE_ANNOTATION.BLUNDER);

  const pgnList = await toPgnList({
    [FEN_STARTING_POSITION]: {
      moves: [{ san: "e4", annotation: e4Annotation.id }, { san: "c4" }],
      comment: "starting position",
      shapes: undefined,
    },
    [FEN_E4]: {
      moves: [{ san: "e5", annotation: undefined }, { san: "c5" }],
      comment: "king's pawn",
      shapes: [],
    },
    [FEN_SICILIAN]: {
      moves: [
        { san: "Nf3", annotation: nf3Annotation.id },
        { san: "Nc3", annotation: nc3Annotation.id },
      ],
      comment: "sicilian",
    },
    [FEN_SICILIAN_NF3]: {
      moves: [{ san: "Nc6" }],
      comment: "sicilian Nf3",
      shapes,
    },
  });

  expect(pgnList.length).toBe(4);
  expect(pgnList[0]).toEqual(
    resultHeader + "{starting position} 1. e4 {king's pawn} e5 *",
  );
  expect(pgnList[1]).toEqual(
    resultHeader +
      "{starting position} 1. e4 {king's pawn} c5 {sicilian} 2. Nf3 {sicilian Nf3} Nc6 *",
  );
  expect(pgnList[2]).toEqual(
    resultHeader +
      "{starting position} 1. e4 {king's pawn} c5 {sicilian} 2. Nc3 *",
  );
  expect(pgnList[3]).toEqual(resultHeader + "{starting position} 1. c4 *");
});
