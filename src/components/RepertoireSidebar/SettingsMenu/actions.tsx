import { modalStore } from "@/stores/modalStore.tsx";
import { exportRepertoireFile } from "@/repertoire/io.ts";
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
import {
  getErrorMessage,
  openErrorToast,
} from "@/external/react-toastify/toasts.ts";
import {
  ANNOTATION_THEME_ATTRIBUTE,
  AnnotationTheme,
} from "@/annotations/defs.ts";

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
    openErrorToast(`Failed to export repertoire ${getErrorMessage(error)}`);
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

export const changeAnnotationTheme = (annotationTheme: AnnotationTheme) => {
  document.documentElement.setAttribute(
    ANNOTATION_THEME_ATTRIBUTE,
    annotationTheme,
  );

  repertoireSettingsStore.upsertSettings({
    annotationTheme,
  });

  import(`@/annotations/annotations.${annotationTheme}.css`);
};
