import { describe, expect, test } from "vitest";
import { parsePgn } from "chessops/pgn";
import {
  ANNOTATION_SETTINGS,
  AnnotationSetting,
  FEN_STARTING_POSITION,
  ImportPgnOptions,
  RepertoireMove,
} from "@/defs.ts";
import { DrawShape } from "chessground/draw";
import { FEN_E4, FEN_SICILIAN, toRepertoireHeader } from "@/tests/testUtils.ts";
import { getAnnotation } from "@/assets/annotation/defs.ts";
import { importGame } from "@/pgn/import/importGame.ts";

const importPgn = async (
  pgn: string,
  options: Partial<ImportPgnOptions> = {},
) => {
  const moves: RepertoireMove[] = [];
  const annotations: AnnotationSetting[] = [];
  const comments: string[] = [];
  const shapes: DrawShape[] = [];

  await importGame(parsePgn(pgn)[0], {
    upsertMove: async (_, move, annotation) => {
      moves.push(move);
      if (annotation) annotations.push(annotation);
      return Promise.resolve();
    },
    setComment: async (_, comment) => {
      comments.push(comment);
      return Promise.resolve();
    },
    setShapes: async (_, drawShapes) => {
      shapes.push(...drawShapes);
      return Promise.resolve();
    },
    annotationSetting: ANNOTATION_SETTINGS.NONE,
    includeComments: true,
    includeShapes: true,
    ...options,
  });

  return { moves, comments, shapes, annotations };
};

test("Import move", async () => {
  const { moves } = await importPgn("1. e4");

  expect(moves).toEqual([{ san: "e4" }]);
});

test("Import comment", async () => {
  const { comments } = await importPgn("1. e4 {Here is a comment}");

  expect(comments).toEqual(["Here is a comment"]);
});

test("Respects includeComments option", async () => {
  const { comments } = await importPgn("1. e4 {Here is a comment}", {
    includeComments: false,
  });

  expect(comments).toEqual([]);
});

test("Respects maxMoveNumber option", async () => {
  const { moves } = await importPgn("1. e4 c5 2. Nf3 Nc6 3. d4", {
    maxMoveNumber: 2,
  });

  expect(moves).toEqual([
    { san: "e4" },
    { san: "c5" },
    { san: "Nf3" },
    { san: "Nc6" },
  ]);
});

test("Respects annotationSetting option", async () => {
  const { annotations } = await importPgn("1. e4 c5", {
    annotationSetting: ANNOTATION_SETTINGS.GOOD,
  });

  expect(annotations).toEqual([
    ANNOTATION_SETTINGS.GOOD,
    ANNOTATION_SETTINGS.GOOD,
  ]);
});

describe("Unsupported games", () => {
  test("Non-standard variant", async () => {
    const variantHeader = '[Variant "Atomic"]\n\n';

    const { moves } = await importPgn(variantHeader + "1. e4");

    expect(moves).toEqual([]);
  });

  test("FEN in non-starting position", async () => {
    const variantHeader = `[FEN "${FEN_SICILIAN}"]\n\n`;

    const { moves } = await importPgn(variantHeader + "1. Nf3");

    expect(moves).toEqual([]);
  });
});

describe("Player settings", () => {
  test("Respects white player option", async () => {
    const fenHeader = `[FEN "${FEN_STARTING_POSITION}"]\n\n`;
    const variantHeader = '[Variant "Standard"]\n';
    const playerHeader = '[White "PastaProgrammer"]\n\n';
    const { annotations } = await importPgn(
      fenHeader + variantHeader + playerHeader + "1. e4 c5 2. Nf3 Nc6",
      {
        annotationSetting: ANNOTATION_SETTINGS.BRILLIANT,
        playerSettings: {
          playerName: "PastaProgrammer",
          opponentAnnotationSetting: ANNOTATION_SETTINGS.NEUTRAL,
        },
      },
    );

    expect(annotations).toEqual([
      ANNOTATION_SETTINGS.BRILLIANT,
      ANNOTATION_SETTINGS.NEUTRAL,
      ANNOTATION_SETTINGS.BRILLIANT,
      ANNOTATION_SETTINGS.NEUTRAL,
    ]);
  });

  test("Respects black player option", async () => {
    const playerHeader = '[Black "PastaProgrammer"]\n\n';
    const { annotations } = await importPgn(
      playerHeader + "1. e4 c5 2. Nf3 Nc6",
      {
        annotationSetting: ANNOTATION_SETTINGS.BRILLIANT,
        playerSettings: {
          playerName: "PastaProgrammer",
          opponentAnnotationSetting: ANNOTATION_SETTINGS.NEUTRAL,
        },
      },
    );

    expect(annotations).toEqual([
      ANNOTATION_SETTINGS.NEUTRAL,
      ANNOTATION_SETTINGS.BRILLIANT,
      ANNOTATION_SETTINGS.NEUTRAL,
      ANNOTATION_SETTINGS.BRILLIANT,
    ]);
  });

  test("Ignores non-existing player name", async () => {
    const playerHeader = '[Black "Unknown"]\n\n';
    const { annotations } = await importPgn(
      playerHeader + "1. e4 c5 2. Nf3 Nc6",
      {
        annotationSetting: ANNOTATION_SETTINGS.BRILLIANT,
        playerSettings: {
          playerName: "PastaProgrammer",
          opponentAnnotationSetting: ANNOTATION_SETTINGS.NEUTRAL,
        },
      },
    );

    expect(annotations).toEqual([
      ANNOTATION_SETTINGS.BRILLIANT,
      ANNOTATION_SETTINGS.BRILLIANT,
      ANNOTATION_SETTINGS.BRILLIANT,
      ANNOTATION_SETTINGS.BRILLIANT,
    ]);
  });
});

describe("Repertoire position", () => {
  test("Imports position annotations", async () => {
    const repertoireHeader = toRepertoireHeader({
      [FEN_STARTING_POSITION]: {
        move: {
          san: "e4",
          annotation: getAnnotation(ANNOTATION_SETTINGS.BLUNDER).symbol,
        },
      },
      [FEN_E4]: {
        move: {
          san: "e5",
          annotation: getAnnotation(ANNOTATION_SETTINGS.INTERESTING).symbol,
        },
      },
    });

    const { annotations } = await importPgn(repertoireHeader + "1. e4 e5");

    expect(annotations).toEqual([
      ANNOTATION_SETTINGS.BLUNDER,
      ANNOTATION_SETTINGS.INTERESTING,
    ]);
  });

  test("Imports shapes", async () => {
    const startingPositionShapes: DrawShape[] = [
      { orig: "a1" },
      { orig: "b1" },
    ];
    const e4Shapes: DrawShape[] = [{ orig: "c1" }, { orig: "d1" }];
    const repertoireHeader = toRepertoireHeader({
      [FEN_STARTING_POSITION]: {
        shapes: startingPositionShapes,
      },
      [FEN_E4]: {
        shapes: e4Shapes,
      },
    });

    const { shapes: importedShapes } = await importPgn(
      repertoireHeader + "1. e4 e5",
    );

    expect(importedShapes).toEqual([...startingPositionShapes, ...e4Shapes]);
  });

  test("Respects includeShapes options", async () => {
    const startingPositionShapes: DrawShape[] = [{ orig: "a1" }];
    const repertoireHeader = toRepertoireHeader({
      [FEN_STARTING_POSITION]: {
        shapes: startingPositionShapes,
      },
    });

    const { shapes: importedShapes } = await importPgn(
      repertoireHeader + "1. e4 e5",
      {
        includeShapes: false,
      },
    );

    expect(importedShapes).toEqual([]);
  });
});
