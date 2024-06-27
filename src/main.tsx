import React from "react";
import ReactDOM from "react-dom/client";
import { RepertoireApp } from "./RepertoireApp.tsx";
import "./assets/fonts/fonts.scss";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalContainer } from "@/components/ModalContainer.tsx";
import { getRepertoireSettings } from "@/stores/localStorageStore.ts";
import { DAISY_UI_THEMES } from "@/defs.ts";
import { BOARD_THEMES, PIECE_THEMES } from "@/external/chessground/defs.tsx";

const queryClient = new QueryClient();

const theme = getRepertoireSettings().theme;
const boardTheme = getRepertoireSettings().boardTheme;
const pieceTheme = getRepertoireSettings().pieceTheme;

if (DAISY_UI_THEMES.includes(theme)) {
  document.documentElement.setAttribute("data-theme", theme);
}
if (Object.values(BOARD_THEMES).includes(boardTheme)) {
  document.documentElement.setAttribute("board-theme", boardTheme);
}
if (Object.values(PIECE_THEMES).includes(pieceTheme)) {
  document.documentElement.setAttribute("piece-theme", pieceTheme);
}

import(
  `@/external/chessground/assets/piece-themes/chessground.pieces.${pieceTheme}.css`
);
import(
  `@/external/chessground/assets/board-themes/chessground.board.${boardTheme}.css`
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RepertoireApp />
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        hideProgressBar
        newestOnTop
        closeOnClick
        theme="dark"
      />
      <ModalContainer />
    </QueryClientProvider>
  </React.StrictMode>,
);
