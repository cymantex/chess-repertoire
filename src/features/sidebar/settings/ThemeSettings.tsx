import {
  changeAnnotationTheme,
  changeBoardTheme,
  changePieceTheme,
  changeTheme,
} from "@/features/sidebar/settings/actions.tsx";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import type { BoardTheme, PieceTheme } from "@/external/chessground/defs.tsx";
import { BOARD_THEMES, PIECE_THEMES } from "@/external/chessground/defs.tsx";
import { SettingsMenuAlert } from "@/features/sidebar/settings/SettingsMenuAlert.tsx";
import { DAISY_UI_THEMES } from "@/features/repertoire/defs.ts";
import type { AnnotationTheme } from "@/features/annotations/defs.ts";
import { ANNOTATION_THEMES } from "@/features/annotations/defs.ts";

export const ThemeSettings = () => {
  const { theme, boardTheme, pieceTheme, annotationTheme } =
    useRepertoireSettings();

  return (
    <>
      <SettingsMenuAlert title="Theming" />
      <select
        className="select w-full mb-2 bg-base-200 text-center"
        onChange={changeTheme}
        value={theme}
      >
        <option disabled>Site theme</option>
        {DAISY_UI_THEMES.map((daisyUiTheme) => (
          <option key={daisyUiTheme} value={daisyUiTheme}>
            {daisyUiTheme}
          </option>
        ))}
      </select>
      <select
        className="select w-full mb-2 bg-base-200 text-center"
        onChange={(e) => changeBoardTheme(e.target.value as BoardTheme)}
        value={boardTheme}
      >
        <option disabled>Board theme</option>
        {Object.values(BOARD_THEMES).map((boardTheme) => (
          <option key={boardTheme} value={boardTheme}>
            {boardTheme}
          </option>
        ))}
      </select>
      <select
        className="select w-full mb-2 bg-base-200 text-center"
        onChange={(e) => changePieceTheme(e.target.value as PieceTheme)}
        value={pieceTheme}
      >
        <option disabled>Piece theme</option>
        {Object.values(PIECE_THEMES).map((pieceTheme) => (
          <option key={pieceTheme} value={pieceTheme}>
            {pieceTheme}
          </option>
        ))}
      </select>
      <select
        className="select w-full mb-2 bg-base-200 text-center"
        onChange={(e) =>
          changeAnnotationTheme(e.target.value as AnnotationTheme)
        }
        value={annotationTheme}
      >
        <option disabled>Annotation theme</option>
        {Object.values(ANNOTATION_THEMES).map((annotationTheme) => (
          <option key={annotationTheme} value={annotationTheme}>
            {annotationTheme}
          </option>
        ))}
      </select>
    </>
  );
};
