import {
  ChildNode,
  defaultGame,
  Game,
  makePgn,
  PgnNodeData,
  PgnParser,
} from "chessops/pgn";
import { Pgn } from "@/external/chessops/defs.ts";
import { INITIAL_FEN } from "chessops/fen";
import {
  setRepertoirePositionComment,
  upsertRepertoireMove,
} from "@/stores/repertoireRepository.ts";
import { Chess } from "chess.js";
import { DEFAULT_SETTINGS } from "@/defs.ts";

export const defaultPgn = (): Pgn => ({
  ...defaultGame(),
  fen: INITIAL_FEN,
});

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

export const toPgn = (pgn: Pgn) => makePgn(pgn)?.split("\n\n")?.[1] ?? "";

export const addMoveToPgn = (
  currentPgn: Pgn,
  san: string,
  previousMoves: string[],
) => {
  const currentMove = findCurrentMove(currentPgn, previousMoves);

  if (currentMove) {
    currentMove.children.push(new ChildNode<PgnNodeData>({ san }));
  }
};

export const findNextMove = (pgn: Pgn, previousMoves: string[]) => {
  const currentMove = findCurrentMove(pgn, previousMoves);

  if (currentMove) {
    return currentMove.children[0];
  }
};

export const getRemainingMainMoves = (pgn: Pgn, previousMoves: string[]) => {
  const currentMove = findCurrentMove(
    pgn,
    previousMoves,
  ) as ChildNode<PgnNodeData>;

  if (currentMove) {
    return Array.from(currentMove.mainlineNodes()).map((node) => node.data.san);
  }

  return [];
};

export const findCurrentMove = (pgn: Pgn, previousMoves: string[]) => {
  if (previousMoves.length === 0) {
    return pgn.moves;
  }

  let currentMove: ChildNode<PgnNodeData> | undefined;

  for (const previousMove of previousMoves) {
    if (currentMove) {
      currentMove = currentMove.children.find(
        (move: ChildNode<PgnNodeData>) => move.data.san === previousMove,
      );
    } else {
      currentMove = pgn.moves.children.find(
        (move) => move.data.san === previousMove,
      );
    }

    if (!currentMove) {
      return;
    }
  }

  return currentMove;
};
