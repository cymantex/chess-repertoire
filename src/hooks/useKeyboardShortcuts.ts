import { useEffect } from "react";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
} from "@/stores/zustand/selectors.ts";
import { localStorageStore } from "@/stores/localStorageStore.ts";
import { ANNOTATION_SETTINGS } from "@/repertoire/defs.ts";

export const useKeyboardShortcuts = () => {
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.target as Element).tagName.toLowerCase() !== "body") {
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
      } else if (event.key === "1") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.BRILLIANT,
        });
      } else if (event.key === "2") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.GOOD,
        });
      } else if (event.key === "3") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.INTERESTING,
        });
      } else if (event.key === "4") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.NEUTRAL,
        });
      } else if (event.key === "5") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.DUBIOUS,
        });
      } else if (event.key === "6") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.BAD,
        });
      } else if (event.key === "7") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.BLUNDER,
        });
      } else if (event.key === "8") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.NONE,
        });
      } else if (event.key === "9") {
        localStorageStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.DONT_SAVE,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToFirstMove, goToPreviousMove, goToNextMove, goToLastMove]);
};
