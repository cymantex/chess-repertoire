import { DAISY_UI_THEMES } from "@/defs.ts";
import {
  changeBoardTheme,
  changePieceTheme,
  changeTheme,
} from "@/components/RepertoireSidebar/SettingsMenu/actions.tsx";
import { useRepertoireSettings } from "@/stores/repertoireSettingsStore.ts";
import {
  BOARD_THEMES,
  BoardTheme,
  PIECE_THEMES,
  PieceTheme,
} from "@/external/chessground/defs.tsx";
import { SettingsMenuAlert } from "@/components/RepertoireSidebar/SettingsMenu/components/SettingsMenuAlert.tsx";

export const ThemeSettings = () => {
  const { theme, boardTheme, pieceTheme } = useRepertoireSettings();

  return (
    <>
      <SettingsMenuAlert title="Theming" />
      <select
        className="select w-full mb-2 bg-base-200 text-center"
        onChange={changeTheme}
        value={theme}
      >
        <option disabled>Site themes</option>
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
    </>
  );
};
