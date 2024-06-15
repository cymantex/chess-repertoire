import { Chess } from "chess.js";

export const toPgn = async (chess: Chess) => {
  chess.header("Result", "*");
  return chess.pgn();
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
