import { Game, PgnNodeData, PgnParser } from "chessops/pgn";
import { Chess } from "chess.js";
import {
  setRepertoirePositionComment,
  upsertRepertoireMove,
} from "@/stores/repertoireRepository.ts";
import { DEFAULT_SETTINGS } from "@/defs.ts";

export const importPgnAsync = async (stream: ReadableStream) => {
  const parser = new PgnParser((game, err) => {
    if (err) {
      // Budget exceeded.
      throw err;
    }

    if (game.headers.get("FEN")) {
      // TODO: Only if not in starting position we should exit
      return;
    }

    return importGame(game);
  });

  const reader = stream.getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      parser.parse("");
      break;
    }
    parser.parse(new TextDecoder().decode(value), { stream: true });
  }
};

const importGame = async (game: Game<PgnNodeData>) => {
  const chess = new Chess();
  // TODO: Max import depth
  const mainLine = Array.from(game.moves.mainlineNodes());

  // TODO: Currently faces race-condition with upsertIdbObject getting an
  // old copy of the data
  for (const move of mainLine) {
    if (move.data.startingComments) {
      await setRepertoirePositionComment(
        chess.fen(),
        move.data.startingComments.join(""),
      );
    }

    // TODO: annotation
    await upsertRepertoireMove(
      chess.fen(),
      { san: move.data.san },
      DEFAULT_SETTINGS.annotationSetting,
    );

    chess.move(move.data.san);

    if (move.data.comments) {
      await setRepertoirePositionComment(
        chess.fen(),
        move.data.comments.join(""),
      );
    }
  }

  console.log(chess.history());
};
