import { Game, PgnNodeData, startingPosition } from "chessops/pgn";
import { isNotEmptyArray } from "@/utils/utils.ts";
import { isNumber } from "lodash";
import { INITIAL_FEN, makeFen } from "chessops/fen";
import { makeSanAndPlay, parseSan } from "chessops/san";
import { CG_BLACK, CG_WHITE, CgColor } from "@/external/chessground/defs.tsx";
import { Position } from "chessops";
import {
  ANNOTATION_SYMBOLS,
  AnnotationSetting,
  ImportPgnGameOptions,
  ImportPgnOptions,
  ImportPgnPlayerSettings,
  RepertoirePgnPosition,
} from "@/defs.ts";

type ParsedPgnOptions = ReturnType<typeof parseImportPgnOptions>;

export const importGame = async (
  game: Game<PgnNodeData>,
  options: ImportPgnGameOptions,
) => {
  if (isUnsupportedGame(game)) {
    return;
  }

  const { mainLine, ...parsedPgnOptions } = parseImportPgnOptions(
    game,
    options,
  );

  const pos = startingPosition(game.headers).unwrap();

  for (const move of mainLine) {
    await importMove(move.data, pos, parsedPgnOptions, options);
  }
};

const importMove = async (
  node: PgnNodeData,
  pos: Position,
  {
    annotationSettings,
    repertoirePgnPositions,
  }: Omit<ParsedPgnOptions, "mainLine">,
  {
    upsertMove,
    setComment,
    setShapes,
    includeComments,
    includeShapes,
  }: ImportPgnGameOptions,
) => {
  const fen = makeFen(pos.toSetup());
  const move = parseSan(pos, node.san);
  const position = repertoirePgnPositions[fen];

  if (includeShapes && isNotEmptyArray(position?.shapes)) {
    await setShapes(fen, position.shapes);
  }

  if (includeComments && isNotEmptyArray(node.startingComments)) {
    await setComment(fen, node.startingComments.join(""));
  }

  const { annotation, overrideAnnotation } = determineAnnotation(
    node.san,
    annotationSettings,
    pos.turn,
    position,
  );

  await upsertMove(fen, { san: node.san }, annotation, overrideAnnotation);

  makeSanAndPlay(pos, move!);

  if (includeComments && isNotEmptyArray(node.comments)) {
    await setComment(makeFen(pos.toSetup()), node.comments.join(""));
  }
};

const isUnsupportedGame = (game: Game<PgnNodeData>) => {
  const fenHeader = game.headers.get("FEN");

  if (fenHeader && fenHeader !== INITIAL_FEN) {
    return true;
  }

  const variantHeader = game.headers.get("Variant");

  return !!(variantHeader && variantHeader !== "Standard");
};

const parseImportPgnOptions = (
  game: Game<PgnNodeData>,
  {
    annotationSetting,
    maxMoveNumber,
    playerSettings,
  }: Pick<
    ImportPgnOptions,
    "annotationSetting" | "maxMoveNumber" | "playerSettings"
  >,
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
      [CG_WHITE]: {
        annotation: annotationSetting,
        overrideAnnotation: true,
      },
      [CG_BLACK]: {
        annotation: opponentAnnotationSetting,
        overrideAnnotation: false,
      },
    } as const;
  } else if (game.headers.get("Black") === playerName) {
    return {
      [CG_WHITE]: {
        annotation: opponentAnnotationSetting,
        overrideAnnotation: false,
      },
      [CG_BLACK]: {
        annotation: annotationSetting,
        overrideAnnotation: true,
      },
    } as const;
  }

  return toDefaultAnnotationSettings(annotationSetting);
};

const toDefaultAnnotationSettings = (annotationSetting: AnnotationSetting) =>
  ({
    [CG_WHITE]: {
      annotation: annotationSetting,
      overrideAnnotation: true,
    },
    [CG_BLACK]: {
      annotation: annotationSetting,
      overrideAnnotation: true,
    },
  }) as const;

const determineAnnotation = (
  san: string,
  annotationSettings: Record<
    CgColor,
    { annotation: AnnotationSetting; overrideAnnotation: boolean }
  >,
  turnColor: CgColor,
  position?: RepertoirePgnPosition,
): { annotation: AnnotationSetting; overrideAnnotation: boolean } => {
  if (position?.move?.san === san) {
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
