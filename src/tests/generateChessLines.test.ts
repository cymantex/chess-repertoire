import { expect, test } from "vitest";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import {
  generateChessLines,
  GetRepertoirePosition,
} from "@/pgn/export/generateChessLines.ts";
import { getAnnotation } from "@/annotations/annotations.tsx";
import { toPgn } from "@/pgn/utils.ts";
import { FEN_E4, FEN_SICILIAN, FEN_SICILIAN_NF3 } from "@/tests/testUtils.ts";
import { RepertoirePosition } from "@/repertoire/defs.ts";
import { MOVE_ANNOTATIONS } from "@/annotations/defs.ts";

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

test("Multiple lines", async () => {
  const e4Annotation = getAnnotation(MOVE_ANNOTATIONS.BRILLIANT);
  const nf3Annotation = getAnnotation(MOVE_ANNOTATIONS.NEUTRAL);
  const nc3Annotation = getAnnotation(MOVE_ANNOTATIONS.BLUNDER);

  const pgnList = await toPgnList({
    [FEN_STARTING_POSITION]: {
      moves: [{ san: "e4", annotation: e4Annotation.id }, { san: "c4" }],
    },
    [FEN_E4]: {
      moves: [{ san: "e5", annotation: undefined }, { san: "c5" }],
      shapes: [],
    },
    [FEN_SICILIAN]: {
      moves: [
        { san: "Nf3", annotation: nf3Annotation.id },
        { san: "Nc3", annotation: nc3Annotation.id },
      ],
    },
    [FEN_SICILIAN_NF3]: {
      moves: [{ san: "Nc6" }],
    },
  });

  expect(pgnList.length).toBe(4);
  expect(pgnList[0]).toEqual(resultHeader + "1. e4 e5 *");
  expect(pgnList[1]).toEqual(resultHeader + "1. e4 c5 2. Nf3 Nc6 *");
  expect(pgnList[2]).toEqual(resultHeader + "1. e4 c5 2. Nc3 *");
  expect(pgnList[3]).toEqual(resultHeader + "1. c4 *");
});
