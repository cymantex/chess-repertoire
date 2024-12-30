import type { Chess } from "chess.js";
import type { PgnMoveData } from "@/external/chessops/defs.ts";

export const toPgn = (chess: Chess) => {
  chess.header("Result", "*");
  return chess.pgn().trimEnd();
};

export const extractPlayerNames = (partialPgn: string) => {
  const playerNames = new Set<string>();

  const whitePlayer = partialPgn.match(/\[White "(.*)"]/);
  if (whitePlayer) {
    playerNames.add(whitePlayer[1]);
  }

  const blackPlayer = partialPgn.match(/\[Black "(.*)"]/);
  if (blackPlayer) {
    playerNames.add(blackPlayer[1]);
  }

  return Array.from(playerNames);
};

export const makeVariation = (
  moves: PgnMoveData[],
  { fenBefore, san }: PgnMoveData,
  initialFen: string,
) => {
  const previousMoves = [{ san }];
  let currentFen = fenBefore;
  let iterationCount = 0;

  while (currentFen && currentFen !== initialFen) {
    iterationCount++;
    const move = moves.find((move) => move.fen === currentFen);

    if (!move || iterationCount > 5000) {
      return undefined;
    }

    previousMoves.unshift(move);
    currentFen = move.fenBefore;
  }

  return previousMoves.map((move) => move.san);
};

/**
 * @param variation A list of tokens representing a variation in a PGN. For
 * example, ["1.", "e4", "e5", "2.", "Nf3", "Nc6"].
 */
export const parseVariation = (
  variation: string[],
): { san: string; moveNumber?: string; id: number }[] => {
  const variationCopy = [...variation];
  const moves: { san: string; moveNumber?: string; id: number }[] = [];
  let id = 0;

  while (variationCopy.length) {
    const token = variationCopy.shift();

    if (!token) {
      break;
    }

    if (/\d\./.test(token)) {
      const san = variationCopy.shift();

      if (!san) {
        // Invalid move, we return what we have so far
        break;
      }

      moves.push({ san, moveNumber: token, id });
    } else {
      moves.push({ san: token, id });
    }

    id++;
  }

  return moves;
};
