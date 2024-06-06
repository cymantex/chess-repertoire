import { useEffect } from "react";
import { useChessRepertoireStore } from "@/store/store.ts";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
} from "@/store/selectors.ts";

export const useKeyboardShortcuts = () => {
  const goToFirstMove = useChessRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useChessRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useChessRepertoireStore(selectGoToNextMove);
  const goToLastMove = useChessRepertoireStore(selectGoToLastMove);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPreviousMove();
      } else if (event.key === "ArrowRight") {
        goToNextMove();
      } else if (event.key === "ArrowUp") {
        goToLastMove();
      } else if (event.key === "ArrowDown") {
        goToFirstMove();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToFirstMove, goToPreviousMove, goToNextMove, goToLastMove]);
};
