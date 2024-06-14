import { Game, PgnNodeData, PgnParser } from "chessops/pgn";
import { Chess } from "chess.js";
import {
  AnnotationSetting,
  DEFAULT_SETTINGS,
  FEN_STARTING_POSITION,
  RepertoireMove,
} from "@/defs.ts";
import { DrawShape } from "chessground/draw";

export interface ImportPgnOptions {
  upsertMove: (
    fen: string,
    repertoireMove: RepertoireMove,
    annotationSetting: AnnotationSetting,
  ) => Promise<void>;
  setShapes: (fen: string, shapes: DrawShape[]) => Promise<void>;
  setComment: (fen: string, comment: string) => Promise<void>;
  annotationSetting: AnnotationSetting;
  includeComments: boolean;
  includeShapes: boolean;
  maxMoveNumber?: number;
  playerSettings?: {
    name: string;
    opponentAnnotationSetting: AnnotationSetting;
  };
}

export const importPgnAsync = async (
  stream: ReadableStream,
  options: ImportPgnOptions,
) => {
  const parser = new PgnParser((game, err) => {
    if (err) {
      throw err;
    }

    return importGame(game, options);
  });

  const reader = stream.getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    parser.parse(new TextDecoder().decode(value), { stream: true });
  }
};

const importGame = async (
  game: Game<PgnNodeData>,
  { upsertMove, setComment }: ImportPgnOptions,
) => {
  if (game.headers.get("FEN") !== FEN_STARTING_POSITION) {
    return;
  }

  const chess = new Chess();
  // TODO: Max import depth
  const mainLine = Array.from(game.moves.mainlineNodes());

  for (const move of mainLine) {
    if (move.data.startingComments) {
      await setComment(chess.fen(), move.data.startingComments.join(""));
    }

    // TODO: annotation (with player consideration)
    await upsertMove(
      chess.fen(),
      { san: move.data.san },
      DEFAULT_SETTINGS.annotationSetting,
    );

    chess.move(move.data.san);

    if (move.data.comments) {
      await setComment(chess.fen(), move.data.comments.join(""));
    }
  }

  console.log(chess.history());
};
