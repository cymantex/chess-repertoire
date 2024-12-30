import { getNonReactiveState } from "@/app/zustand/utils.ts";
import { makePgn } from "chessops/pgn";
import { isNotEmptyArray } from "@/common/utils/utils.ts";

const PGN = "pgn";
const PREVIOUS_MOVES = "previousMoves";

export const saveGameAndReloadPage = () => {
  const { pgn, chess } = getNonReactiveState();

  sessionStorage.setItem(PGN, makePgn(pgn));

  const previousMoves = chess.history();

  if (isNotEmptyArray(previousMoves)) {
    sessionStorage.setItem(PREVIOUS_MOVES, JSON.stringify(chess.history()));
  }

  window.location.reload();
};

export const initializeRepertoireStore = async () => {
  const { listDatabases, getCurrentRepertoirePosition } = getNonReactiveState();
  await listDatabases();
  return Promise.all([getCurrentRepertoirePosition(), restoreGame()]);
};

const restoreGame = async () => {
  const { savePgn, goToPosition } = getNonReactiveState();

  const pgnString = sessionStorage.getItem(PGN);

  if (pgnString) {
    await savePgn(pgnString);
    sessionStorage.removeItem(PGN);
  }

  const previousMovesString = sessionStorage.getItem(PREVIOUS_MOVES);

  if (previousMovesString) {
    const previousMoves = JSON.parse(previousMovesString);

    await goToPosition(previousMoves);
    sessionStorage.removeItem(PREVIOUS_MOVES);
  }
};
