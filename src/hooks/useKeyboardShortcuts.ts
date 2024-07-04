import { useEffect } from "react";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
  selectRotate,
} from "@/stores/zustand/selectors.ts";
import { repertoireSettingsStore } from "@/stores/repertoireSettingsStore.ts";
import { ANNOTATION_SETTINGS } from "@/repertoire/defs.ts";

export const useKeyboardShortcuts = () => {
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);
  const rotate = useRepertoireStore(selectRotate);

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
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.BRILLIANT,
        });
      } else if (event.key === "2") {
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.GOOD,
        });
      } else if (event.key === "3") {
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.INTERESTING,
        });
      } else if (event.key === "4") {
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.NEUTRAL,
        });
      } else if (event.key === "5") {
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.DUBIOUS,
        });
      } else if (event.key === "6") {
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.BAD,
        });
      } else if (event.key === "7") {
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.BLUNDER,
        });
      } else if (event.key === "8") {
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.NONE,
        });
      } else if (event.key === "9") {
        repertoireSettingsStore.upsertSettings({
          annotationSetting: ANNOTATION_SETTINGS.DONT_SAVE,
        });
      } else if (event.key === "f") {
        rotate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [rotate, goToFirstMove, goToPreviousMove, goToNextMove, goToLastMove]);
};
