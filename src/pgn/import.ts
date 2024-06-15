import { ChildNode, Game, parsePgn, PgnNodeData } from "chessops/pgn";
import { BLACK, Chess, Color, WHITE } from "chess.js";
import {
  AnnotationSetting,
  FEN_STARTING_POSITION,
  RepertoireMove,
  RepertoirePgnPosition,
} from "@/defs.ts";
import { DrawShape } from "chessground/draw";
import { chunk, isNumber } from "lodash";
import { ANNOTATION_SYMBOLS } from "@/assets/annotation/defs.ts";
import { isNotEmptyArray } from "@/utils/utils.ts";

interface PlayerSettings {
  playerName: string;
  opponentAnnotationSetting: AnnotationSetting;
}

type ParsedPgnOptions = ReturnType<typeof parseImportPgnOptions>;

export interface ImportPgnOptions {
  upsertMove: (
    fen: string,
    repertoireMove: RepertoireMove,
    annotationSetting: AnnotationSetting,
    overrideExistingAnnotation?: boolean,
  ) => Promise<void>;
  setShapes: (fen: string, shapes: DrawShape[]) => Promise<void>;
  setComment: (fen: string, comment: string) => Promise<void>;
  annotationSetting: AnnotationSetting;
  playerSettings?: PlayerSettings;
  includeComments: boolean;
  includeShapes: boolean;
  maxMoveNumber?: number;
  // TODO: Let user decide if annotations should be overridden
}

export interface ImportPgnProgress {
  totalGames?: number;
  gameCount?: number;
}

interface ImportPgnCallbacks {
  onProgress: (progress: ImportPgnProgress) => void;
}

export const importPgnAsync = async (
  file: File,
  options: ImportPgnOptions,
  { onProgress }: ImportPgnCallbacks,
) => {
  // TODO: Warn user before leaving page

  // TODO: Worker
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        let gameCount = 0;

        const pgn = event.target!.result as string;

        const games = parsePgn(pgn);

        const reportProgressInterval = setInterval(() => {
          onProgress({ totalGames: games.length, gameCount });
        }, 1000);

        const gameChunksList = chunk(games, 200);

        for await (const gameChunk of gameChunksList) {
          await Promise.all(
            gameChunk.map((game) =>
              importGame(game, options)
                .catch(console.error)
                .finally(() => gameCount++),
            ),
          );
        }

        clearInterval(reportProgressInterval);
        resolve(null);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    }, 0);
  });
};

export const importGame = async (
  game: Game<PgnNodeData>,
  options: ImportPgnOptions,
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
  }: ImportPgnOptions,
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
  playerSettings?: PlayerSettings,
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
