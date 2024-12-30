import { getRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import {
  DAISY_UI_THEMES,
  DEFAULT_SETTINGS,
} from "@/features/repertoire/defs.ts";
import {
  BOARD_THEME_ATTRIBUTE,
  BOARD_THEMES,
  PIECE_THEME_ATTRIBUTE,
  PIECE_THEMES,
} from "@/external/chessground/defs.tsx";
import { loadAnnotationTheme } from "@/features/annotations/annotations.tsx";

export const loadThemes = () => {
  const theme = getRepertoireSettings().theme;
  const { boardTheme, pieceTheme } = getRepertoireSettings();

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

  loadAnnotationTheme();
};
