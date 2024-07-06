import { isNumber } from "lodash";
import {
  ALLOWED_GLOBAL_SHORTCUT_TAG_TYPES,
  BREAKPOINT_MD,
  DAISY_UI_THEMES,
} from "@/defs.ts";
import { PgnMoveData } from "@/external/chessops/defs.ts";
import { getRepertoireSettings } from "@/stores/repertoireSettingsStore.ts";
import {
  BOARD_THEME_ATTRIBUTE,
  BOARD_THEMES,
  PIECE_THEME_ATTRIBUTE,
  PIECE_THEMES,
} from "@/external/chessground/defs.tsx";
import { DEFAULT_SETTINGS } from "@/repertoire/defs.ts";

export const isNotEmptyArray = <T>(array?: T[]): array is T[] =>
  Array.isArray(array) && array.length > 0;

export const toSearchTimeDisplayName = (searchTimeSeconds: number) =>
  searchTimeSeconds === Infinity ? "∞" : `${searchTimeSeconds}s`;

export const toCpDisplayName = (cp: number) =>
  cp < 0 ? `${(cp / 100).toFixed(2)}` : `+${(cp / 100).toFixed(2)}`;

export const toAnalysisResultEvaluation = (result?: {
  cp?: number;
  mate?: number;
}) => {
  if (!result) {
    return "--.--";
  }

  if (result.mate) {
    return `#${result.mate}`;
  }

  if (!isNumber(result.cp)) {
    return "--.--";
  }

  return isNumber(result.cp) ? toCpDisplayName(result.cp) : "--.--";
};

export const downloadUrl = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const downloadUInt8Array = (
  uint8Array: Uint8Array,
  fileName: string,
) => {
  const url = URL.createObjectURL(new Blob([uint8Array]));

  downloadUrl(url, fileName);
};

export const isMobileSize = () => window.innerWidth <= BREAKPOINT_MD;

export const getCurrentDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  // add leading zero if necessary
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  // add leading zero if necessary
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

export const toRepertoireFileNameWithoutDate = (
  repertoireDisplayName: string,
) => `repertoire-${repertoireDisplayName.replace(/[^a-zA-Z0-9]/g, "")}`;

export const toRepertoireFileName = (repertoireDisplayName: string) =>
  `${toRepertoireFileNameWithoutDate(repertoireDisplayName)}-${getCurrentDate()}`;

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

/**
 * Removes all decorations from a SAN string. For example Nf3+!? becomes Nf3.
 */
export const removeDecorations = (san: string) =>
  san.replace(/=/, "").replace(/[+#]?[?!]*$/, "");

export const loadThemes = () => {
  const theme = getRepertoireSettings().theme;
  const boardTheme = getRepertoireSettings().boardTheme;
  const pieceTheme = getRepertoireSettings().pieceTheme;

  if (DAISY_UI_THEMES.includes(theme)) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  if (Object.values(BOARD_THEMES).includes(boardTheme)) {
    document.documentElement.setAttribute(BOARD_THEME_ATTRIBUTE, boardTheme);
    import(
      `@/external/chessground/assets/board-themes/chessground.board.${boardTheme}.css`
    );
  } else {
    import(
      `@/external/chessground/assets/board-themes/chessground.board.${DEFAULT_SETTINGS.boardTheme}.css`
    );
  }

  if (Object.values(PIECE_THEMES).includes(pieceTheme)) {
    document.documentElement.setAttribute(PIECE_THEME_ATTRIBUTE, pieceTheme);
    import(
      `@/external/chessground/assets/piece-themes/chessground.pieces.${pieceTheme}.css`
    );
  } else {
    import(
      `@/external/chessground/assets/piece-themes/chessground.pieces.${DEFAULT_SETTINGS.pieceTheme}.css`
    );
  }
};

export const isAllowedGlobalShortcutTagType = (event: KeyboardEvent) => {
  const tagName = (event.target as Element).tagName.toLowerCase();
  return ALLOWED_GLOBAL_SHORTCUT_TAG_TYPES.includes(tagName);
};

export const createTimeoutPromise = (timeoutMs: number) =>
  new Promise<void>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject();
    }, timeoutMs);
  });
