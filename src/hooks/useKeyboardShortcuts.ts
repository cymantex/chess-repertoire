import { useEffect } from "react";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
} from "@/store/selectors.ts";

export const useKeyboardShortcuts = () => {
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.target as Element).tagName.toLowerCase() === "textarea") {
        return;
      }

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
