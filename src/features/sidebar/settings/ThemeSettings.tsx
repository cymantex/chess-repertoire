import type { ReactNode, SelectHTMLAttributes } from "react";
import { useId } from "react";
import { FaPalette } from "react-icons/fa";
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

const boardNames: Record<BoardTheme, string> = {
  blue2: "Blue",
  grey: "Grey",
  marble: "Marble",
  maple: "Maple",
  olive: "Olive",
  wood2: "Wood",
};

export const ThemeSettings = () => {
  const { theme, boardTheme, pieceTheme, annotationTheme } =
    useRepertoireSettings();

  return (
    <>
      <SettingsMenuAlert title="Appearance" />
      <div className="grid grid-cols-2 gap-3">
        <ThemeSelect
          label="Site theme"
          preview={<FaPalette className="text-base-content/60" />}
          onChange={changeTheme}
          value={theme}
        >
          {DAISY_UI_THEMES.map((daisyUiTheme) => (
            <option key={daisyUiTheme} value={daisyUiTheme}>
              {daisyUiTheme === "black" ? "Dark" : "Light"}
            </option>
          ))}
        </ThemeSelect>
        <ThemeSelect
          label="Board"
          preview={
            <span
              className="h-6 w-6 shrink-0 rounded bg-[length:400%]"
              style={{ backgroundImage: "var(--cg-board-background-image)" }}
            />
          }
          onChange={(e) => changeBoardTheme(e.target.value as BoardTheme)}
          value={boardTheme}
        >
          {Object.values(BOARD_THEMES).map((boardTheme) => (
            <option key={boardTheme} value={boardTheme}>
              {boardNames[boardTheme]}
            </option>
          ))}
        </ThemeSelect>
        <ThemeSelect
          label="Pieces"
          preview={
            <span
              className="h-6 w-6 shrink-0 rounded bg-accent/20 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "var(--piece-knight-white)" }}
            />
          }
          onChange={(e) => changePieceTheme(e.target.value as PieceTheme)}
          value={pieceTheme}
        >
          {Object.values(PIECE_THEMES).map((pieceTheme) => (
            <option key={pieceTheme} value={pieceTheme}>
              {pieceTheme}
            </option>
          ))}
        </ThemeSelect>
        <ThemeSelect
          label="Annotations"
          preview={
            <span className="annotation-icon__container shrink-0 bg-accent">
              <span className="annotation-icon annotation-icon__brilliant" />
            </span>
          }
          onChange={(e) =>
            changeAnnotationTheme(e.target.value as AnnotationTheme)
          }
          value={annotationTheme}
        >
          {Object.values(ANNOTATION_THEMES).map((annotationTheme) => (
            <option key={annotationTheme} value={annotationTheme}>
              {annotationTheme}
            </option>
          ))}
        </ThemeSelect>
      </div>
    </>
  );
};

interface ThemeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  preview: ReactNode;
}

const ThemeSelect = ({
  label,
  preview,
  children,
  ...props
}: ThemeSelectProps) => {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-base-300 bg-base-200/40 p-3">
      <label
        htmlFor={id}
        className="mb-2 flex min-h-6 items-center justify-between gap-2 text-sm font-medium"
      >
        {label}
        <span aria-hidden="true" className="flex shrink-0 items-center">
          {preview}
        </span>
      </label>
      <select
        {...props}
        id={id}
        aria-describedby={`${id}-hint`}
        className="select select-sm select-bordered mt-auto w-full bg-base-100 font-normal capitalize focus-visible:outline-accent"
      >
        {children}
      </select>
    </div>
  );
};
