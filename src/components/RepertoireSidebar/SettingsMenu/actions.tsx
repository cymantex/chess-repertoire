import { modalStore } from "@/stores/modalStore.tsx";
import { exportRepertoireFile } from "@/repertoire/repertoireIo.ts";
import { ChangeEvent } from "react";
import { repertoireSettingsStore } from "@/stores/repertoireSettingsStore.ts";
import { DaisyUiTheme } from "@/repertoire/defs.ts";
import {
  BOARD_THEME_ATTRIBUTE,
  BoardTheme,
  PIECE_THEME_ATTRIBUTE,
  PieceTheme,
} from "@/external/chessground/defs.tsx";
import { MODAL_IDS } from "@/defs.ts";
import { openErrorToast } from "@/external/react-toastify/toasts.ts";

export async function exportRepertoire() {
  modalStore.addLoadingModal(
    <>
      Exporting repertoire... <br />
      <span className="text-sm">(this could take many minutes)</span>
    </>,
  );

  window.onbeforeunload = (event) => event.preventDefault();

  try {
    await exportRepertoireFile();
  } catch (error) {
    console.error(error);
    // @ts-ignore
    openErrorToast(`Failed to export repertoire ${error.message}`);
  } finally {
    window.onbeforeunload = null;
  }

  modalStore.closeModal(MODAL_IDS.LOADING);
}

export const changeTheme = (event: ChangeEvent<HTMLSelectElement>) => {
  if (!event.target.value) return;

  document.documentElement.setAttribute("data-theme", event.target.value);

  repertoireSettingsStore.upsertSettings({
    theme: event.target.value as DaisyUiTheme,
  });
};

export const changePieceTheme = (pieceTheme: PieceTheme) => {
  document.documentElement.setAttribute(PIECE_THEME_ATTRIBUTE, pieceTheme);

  repertoireSettingsStore.upsertSettings({
    pieceTheme,
  });

  import(
    `@/external/chessground/assets/piece-themes/chessground.pieces.${pieceTheme}.css`
  );
};

export const changeBoardTheme = (boardTheme: BoardTheme) => {
  document.documentElement.setAttribute(BOARD_THEME_ATTRIBUTE, boardTheme);

  repertoireSettingsStore.upsertSettings({
    boardTheme,
  });

  import(
    `@/external/chessground/assets/board-themes/chessground.board.${boardTheme}.css`
  );
};
