import { ChildNode, Game, PgnNodeData } from "chessops/pgn";
import {
  AnnotationSetting,
  FEN_STARTING_POSITION,
  ImportPgnGameOptions,
  ImportPgnOptions,
  ImportPgnPlayerSettings,
  RepertoirePgnPosition,
} from "@/defs.ts";
import { BLACK, Chess, Color, WHITE } from "chess.js";
import { isNotEmptyArray } from "@/utils/utils.ts";
import { isNumber } from "lodash";
import { ANNOTATION_SYMBOLS } from "@/assets/annotation/defs.ts";

type ParsedPgnOptions = ReturnType<typeof parseImportPgnOptions>;

export const importGame = async (
  game: Game<PgnNodeData>,
  options: ImportPgnGameOptions,
) => {
  if (isUnsupportedGame(game)) {
    return;
  }

  const parsedOptions = parseImportPgnOptions(game, options);

  const chess = new Chess();

  for (const move of parsedOptions.mainLine) {
    try {
      await importMove(move, chess, parsedOptions, options);
    } catch (error) {
      console.error(error);
      console.log(game.headers);
      console.log(chess.history());
      return;
    }
  }
};

const importMove = async (
  move: ChildNode<PgnNodeData>,
  chess: Chess,
  { annotationSettings, repertoirePgnPositions }: ParsedPgnOptions,
  {
    upsertMove,
    setComment,
    setShapes,
    includeComments,
    includeShapes,
  }: ImportPgnGameOptions,
) => {
  const fen = chess.fen();
  const position = repertoirePgnPositions[fen];

  if (includeShapes && isNotEmptyArray(position?.shapes)) {
    await setShapes(fen, position.shapes);
  }

  if (includeComments && isNotEmptyArray(move.data.startingComments)) {
    await setComment(fen, move.data.startingComments.join(""));
  }

  const { annotation, overrideAnnotation } = determineAnnotation(
    move,
    annotationSettings,
    chess.turn(),
    position,
  );

  await upsertMove(fen, { san: move.data.san }, annotation, overrideAnnotation);

  chess.move(move.data.san);

  if (includeComments && isNotEmptyArray(move.data.comments)) {
    await setComment(chess.fen(), move.data.comments.join(""));
  }
};
const isUnsupportedGame = (game: Game<PgnNodeData>) => {
  const fenHeader = game.headers.get("FEN");

  if (fenHeader && fenHeader !== FEN_STARTING_POSITION) {
    return true;
  }

  const variantHeader = game.headers.get("Variant");

  return !!(variantHeader && variantHeader !== "Standard");
};
const parseImportPgnOptions = (
  game: Game<PgnNodeData>,
  { annotationSetting, maxMoveNumber, playerSettings }: ImportPgnOptions,
) => {
  let mainLine = Array.from(game.moves.mainlineNodes());

  if (isNumber(maxMoveNumber)) {
    mainLine = mainLine.slice(0, maxMoveNumber * 2);
  }

  return {
    annotationSettings: parseAnnotationSettings(
      game,
      annotationSetting,
      playerSettings,
    ),
    repertoirePgnPositions: parseRepertoirePgnPositions(game),
    mainLine,
  };
};
const parseRepertoirePgnPositions = (
  game: Game<PgnNodeData>,
): Record<string, RepertoirePgnPosition> => {
  if (!game.headers.has("Repertoire")) {
    return {};
  }

  return JSON.parse(game.headers.get("Repertoire")!.replaceAll("'", '"'));
};
const parseAnnotationSettings = (
  game: Game<PgnNodeData>,
  annotationSetting: AnnotationSetting,
  playerSettings?: ImportPgnPlayerSettings,
): Record<
  string,
  { annotation: AnnotationSetting; overrideAnnotation: boolean }
> => {
  if (!playerSettings) {
    return toDefaultAnnotationSettings(annotationSetting);
  }

  const { playerName, opponentAnnotationSetting } = playerSettings;

  if (game.headers.get("White") === playerName) {
    return {
      [WHITE]: {
        annotation: annotationSetting,
        overrideAnnotation: true,
      },
      [BLACK]: {
        annotation: opponentAnnotationSetting,
        overrideAnnotation: false,
      },
    } as const;
  } else if (game.headers.get("Black") === playerName) {
    return {
      [WHITE]: {
        annotation: opponentAnnotationSetting,
        overrideAnnotation: false,
      },
      [BLACK]: {
        annotation: annotationSetting,
        overrideAnnotation: true,
      },
    } as const;
  }

  return toDefaultAnnotationSettings(annotationSetting);
};
const toDefaultAnnotationSettings = (annotationSetting: AnnotationSetting) =>
  ({
    [WHITE]: {
      annotation: annotationSetting,
      overrideAnnotation: true,
    },
    [BLACK]: {
      annotation: annotationSetting,
      overrideAnnotation: true,
    },
  }) as const;
const determineAnnotation = (
  move: ChildNode<PgnNodeData>,
  annotationSettings: Record<
    Color,
    { annotation: AnnotationSetting; overrideAnnotation: boolean }
  >,
  turnColor: Color,
  position?: RepertoirePgnPosition,
): { annotation: AnnotationSetting; overrideAnnotation: boolean } => {
  if (position?.move?.san === move.data.san) {
    if (position!.move!.annotation in ANNOTATION_SYMBOLS) {
      return {
        annotation:
          ANNOTATION_SYMBOLS[
            position!.move!.annotation as keyof typeof ANNOTATION_SYMBOLS
          ],
        overrideAnnotation: true,
      };
    }
  }

  return annotationSettings[turnColor]!;
};
