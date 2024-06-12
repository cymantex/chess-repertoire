import { expect, test } from "vitest";
import {
  FEN_STARTING_POSITION,
  REPERTOIRE_ANNOTATION,
  RepertoirePosition,
} from "@/defs.ts";
import {
  generateChessLines,
  GetRepertoirePosition,
} from "@/utils/generateChessLines.ts";
import { toPgn } from "@/external/chessjs/utils.ts";
import { getAnnotation } from "@/assets/annotation/defs.ts";
import { DrawShape } from "chessground/draw";

const FEN_E4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
const FEN_SICILIAN =
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";
const FEN_SICILIAN_NF3 =
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";
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
    const pgn = await toPgn(chess, getRepertoirePosition);
    pgnList.push(pgn);
  }

  return pgnList;
};

const toRepertoireHeader = (object: object) =>
  `[Result "*"]\n[Repertoire "${JSON.stringify(object).replaceAll('"', "'")}"]\n\n`;

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
  const game1RepertoireHeader = {
    [FEN_STARTING_POSITION]: {
      move: {
        san: "e4",
        annotation: e4Annotation.symbol,
      },
    },
  };
  const game2RepertoireHeader = {
    ...game1RepertoireHeader,
    [FEN_SICILIAN]: {
      move: {
        san: "Nf3",
        annotation: nf3Annotation.symbol,
      },
    },
    [FEN_SICILIAN_NF3]: {
      shapes,
    },
  };
  const game3RepertoireHeader = {
    ...game1RepertoireHeader,
    [FEN_SICILIAN]: {
      move: {
        san: "Nc3",
        annotation: nc3Annotation.symbol,
      },
    },
  };

  const pgnList = await toPgnList({
    [FEN_STARTING_POSITION]: {
      moves: [{ san: "e4", annotation: e4Annotation.id }, { san: "c4" }],
      comment: "starting position",
    },
    [FEN_E4]: {
      moves: [{ san: "e5" }, { san: "c5" }],
      comment: "king's pawn",
    },
    [FEN_SICILIAN]: {
      moves: [
        { san: "Nf3", annotation: nf3Annotation.id },
        { san: "Nc3", annotation: nc3Annotation.id },
      ],
      comment: "sicilian",
    },
    [FEN_SICILIAN_NF3]: {
      moves: [],
      comment: "sicilian Nf3",
      shapes,
    },
  });

  expect(pgnList.length).toBe(4);
  expect(pgnList[0]).toEqual(
    toRepertoireHeader(game1RepertoireHeader) +
      "{starting position} 1. e4 {king's pawn} e5 *",
  );
  expect(pgnList[1]).toEqual(
    toRepertoireHeader(game2RepertoireHeader) +
      "{starting position} 1. e4 {king's pawn} c5 {sicilian} 2. Nf3 {sicilian Nf3} *",
  );
  expect(pgnList[2]).toEqual(
    toRepertoireHeader(game3RepertoireHeader) +
      "{starting position} 1. e4 {king's pawn} c5 {sicilian} 2. Nc3 *",
  );
  expect(pgnList[3]).toEqual(resultHeader + "{starting position} 1. c4 *");
});
