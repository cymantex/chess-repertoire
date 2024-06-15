import { Game, PgnNodeData, startingPosition } from "chessops/pgn";
import { isNotEmptyArray } from "@/utils/utils.ts";
import { isNumber } from "lodash";
import { makeFen } from "chessops/fen";
import { makeSanAndPlay, parseSan } from "chessops/san";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.tsx";
import { Position } from "chessops";
import {
  ImportPgnGameOptions,
  ImportPgnOptions,
  ImportPgnPlayerSettings,
} from "@/pgn/import/defs.ts";
import { AnnotationSetting } from "@/repertoire/defs.ts";
import { FEN_STARTING_POSITION } from "@/defs.ts";

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

  const { annotation, overrideAnnotation } = annotationSettings[pos.turn];

  await upsertMove(fen, { san: node.san }, annotation, overrideAnnotation);

  makeSanAndPlay(pos, move!);

  if (includeComments && isNotEmptyArray(node.comments)) {
    await setComment(makeFen(pos.toSetup()), node.comments.join(""));
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
    mainLine,
  };
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
