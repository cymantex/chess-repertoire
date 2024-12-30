import type {
  Game,
  PgnNodeData} from "chessops/pgn";
import {
  ChildNode,
  startingPosition,
  transform,
} from "chessops/pgn";
import type { RenderPgnNodeData } from "./defs.ts";
import { makeSanAndPlay, parseSan } from "chessops/san";
import { makeFen } from "chessops/fen";

export const addVariationToPgn = (
  currentPgn: Game<PgnNodeData>,
  movesFromStartingPosition: string[],
) => {
  movesFromStartingPosition.forEach((san, i) => {
    const previousMoves = movesFromStartingPosition.slice(0, i);
    const pgnMove = findCurrentMove(currentPgn, previousMoves);

    if (!pgnMove) {
      currentPgn.moves.children.push(new ChildNode<PgnNodeData>({ san }));
    } else if (!pgnMove.children.some((move) => move.data.san === san)) {
      pgnMove.children.push(new ChildNode<PgnNodeData>({ san }));
    } // Else the move already exists in the PGN tree
  });
};

export const addMoveToPgn = (
  currentPgn: Game<PgnNodeData>,
  san: string,
  previousMoves: string[],
) => {
  const currentMove = findCurrentMove(currentPgn, previousMoves);

  if (
    currentMove &&
    !currentMove.children.some((move) => move.data.san === san)
  ) {
    currentMove.children.push(new ChildNode<PgnNodeData>({ san }));
  }
};

export const findNextMove = (
  pgn: Game<PgnNodeData>,
  previousMoves: string[],
) => {
  const currentMove = findCurrentMove(pgn, previousMoves);

  if (currentMove) {
    return currentMove.children[0];
  }
};

export const hasNextMove = (
  pgn: Game<PgnNodeData>,
  previousMoves: string[],
) => {
  return !!findNextMove(pgn, previousMoves);
};

export const getRemainingMainMoves = (
  pgn: Game<PgnNodeData>,
  previousMoves: string[],
) => {
  const currentMove = findCurrentMove(
    pgn,
    previousMoves,
  ) as ChildNode<PgnNodeData>;

  if (currentMove) {
    return Array.from(currentMove.mainlineNodes()).map((node) => node.data.san);
  }

  return [];
};

export const findCurrentMove = (
  pgn: Game<PgnNodeData>,
  previousMoves: string[],
) => {
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

/**
 * Based on example from https://niklasf.github.io/chessops/modules/pgn.html
 */
export const enrichMovesWithFen = (
  pgn: Game<PgnNodeData>,
): Game<RenderPgnNodeData> => {
  const pos = startingPosition(pgn.headers).unwrap();

  pgn.moves = transform(pgn.moves, pos, (pos, node) => {
    const move = parseSan(pos, node.san);
    const fenBefore = makeFen(pos.toSetup());

    if (!move) {
      // Illegal move. Returning undefined cuts off the tree here.
      return;
    }

    const san = makeSanAndPlay(pos, move); // Mutating pos!

    return {
      ...node, // Keep comments and annotation glyphs
      san, // Normalized SAN
      fen: makeFen(pos.toSetup()),
      fenBefore,
    };
  });

  return pgn as Game<RenderPgnNodeData>;
};
