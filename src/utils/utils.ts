import { ALLOWED_GLOBAL_SHORTCUT_TAG_TYPES, BREAKPOINT_MD } from "@/defs.ts";
import { getRepertoireSettings } from "@/stores/repertoireSettingsStore.ts";
import {
  BOARD_THEME_ATTRIBUTE,
  BOARD_THEMES,
  PIECE_THEME_ATTRIBUTE,
  PIECE_THEMES,
} from "@/external/chessground/defs.tsx";
import { DAISY_UI_THEMES, DEFAULT_SETTINGS } from "@/repertoire/defs.ts";

export const isNotEmptyArray = <T>(array?: T[]): array is T[] =>
  Array.isArray(array) && array.length > 0;

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
