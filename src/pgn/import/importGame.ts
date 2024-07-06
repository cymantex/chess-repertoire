import { Game, PgnNodeData, startingPosition } from "chessops/pgn";
import { isNotEmptyArray } from "@/utils/utils.ts";
import { isNumber } from "lodash";
import { makeFen } from "chessops/fen";
import { makeSanAndPlay, parseSan } from "chessops/san";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.tsx";
import { Position } from "chessops";
import { ImportPgnGameOptions, ImportPgnOptions } from "@/pgn/import/defs.ts";
import { AnnotationSetting, REPERTOIRE_ANNOTATION } from "@/repertoire/defs.ts";
import { FEN_STARTING_POSITION, PGN_HEADERS } from "@/defs.ts";

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
  { annotationSettings }: Omit<ParsedPgnOptions, "mainLine">,
  { upsertMove, setComment, includeComments }: ImportPgnGameOptions,
) => {
  const fen = makeFen(pos.toSetup());
  const move = parseSan(pos, node.san);

  if (includeComments && isNotEmptyArray(node.startingComments)) {
    await setComment(fen, node.startingComments.join(""));
  }

  const { annotation, replaceAnnotations } = annotationSettings[pos.turn];
  const moveAnnotation = extractMoveAnnotation(node);

  await upsertMove(
    fen,
    { san: node.san },
    moveAnnotation ?? annotation,
    replaceAnnotations,
  );

  try {
    makeSanAndPlay(pos, move!);
  } catch (e) {
    console.error(`Error importing move ${node.san}`, e);
    return;
  }

  if (includeComments && isNotEmptyArray(node.comments)) {
    await setComment(makeFen(pos.toSetup()), node.comments.join(""));
  }
};

const extractMoveAnnotation = (
  node: PgnNodeData,
): AnnotationSetting | undefined => {
  if (!isNotEmptyArray(node.nags)) {
    return;
  }

  const nag = node.nags[0]!;

  switch (nag) {
    case 1:
      return REPERTOIRE_ANNOTATION.GOOD;
    case 2:
      return REPERTOIRE_ANNOTATION.BAD;
    case 3:
      return REPERTOIRE_ANNOTATION.BRILLIANT;
    case 4:
      return REPERTOIRE_ANNOTATION.BLUNDER;
    case 5:
      return REPERTOIRE_ANNOTATION.INTERESTING;
    case 6:
      return REPERTOIRE_ANNOTATION.DUBIOUS;
    default:
      return;
  }
};

const isUnsupportedGame = (game: Game<PgnNodeData>) => {
  const fenHeader = game.headers.get(PGN_HEADERS.FEN);

  // TODO: Add support for FEN header
  if (fenHeader && fenHeader !== FEN_STARTING_POSITION) {
    return true;
  }

  const variantHeader = game.headers.get(PGN_HEADERS.VARIANT);

  return !!(variantHeader && variantHeader !== PGN_HEADERS.STANDARD);
};

const parseImportPgnOptions = (
  game: Game<PgnNodeData>,
  { maxMoveNumber, ...options }: ImportPgnOptions,
) => {
  let mainLine = Array.from(game.moves.mainlineNodes());

  if (isNumber(maxMoveNumber)) {
    mainLine = mainLine.slice(0, maxMoveNumber * 2);
  }

  return {
    annotationSettings: parseAnnotationSettings(game, options),
    mainLine,
  };
};

const parseAnnotationSettings = (
  game: Game<PgnNodeData>,
  { annotationSetting, playerSettings, replaceAnnotations }: ImportPgnOptions,
): Record<
  string,
  { annotation: AnnotationSetting; replaceAnnotations: boolean }
> => {
  if (!playerSettings) {
    return toDefaultAnnotationSettings(annotationSetting, replaceAnnotations);
  }

  const { playerName, opponentAnnotationSetting } = playerSettings;

  if (game.headers.get("White") === playerName) {
    return {
      [CG_WHITE]: {
        annotation: annotationSetting,
        replaceAnnotations,
      },
      [CG_BLACK]: {
        annotation: opponentAnnotationSetting,
        replaceAnnotations: false,
      },
    } as const;
  } else if (game.headers.get("Black") === playerName) {
    return {
      [CG_WHITE]: {
        annotation: opponentAnnotationSetting,
        replaceAnnotations: false,
      },
      [CG_BLACK]: {
        annotation: annotationSetting,
        replaceAnnotations,
      },
    } as const;
  }

  return toDefaultAnnotationSettings(annotationSetting, replaceAnnotations);
};

const toDefaultAnnotationSettings = (
  annotationSetting: AnnotationSetting,
  replaceAnnotations: boolean,
) =>
  ({
    [CG_WHITE]: {
      annotation: annotationSetting,
      replaceAnnotations,
    },
    [CG_BLACK]: {
      annotation: annotationSetting,
      replaceAnnotations,
    },
  }) as const;
