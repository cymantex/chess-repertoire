import { useEffect } from "react";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import { repertoireSettingsStore } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { isAllowedGlobalShortcutTagType } from "@/common/utils/utils.ts";

import { ANNOTATION_SETTINGS } from "@/features/annotations/defs.ts";
import { exportRepertoire } from "@/features/sidebar/settings/actions.tsx";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
} from "@/features/navigation/navigationSlice.ts";

export const useKeyboardShortcuts = () => {
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isAllowedGlobalShortcutTagType(event)) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          goToPreviousMove();
          break;
        case "ArrowRight":
          goToNextMove();
          break;
        case "ArrowUp":
          goToLastMove();
          break;
        case "ArrowDown":
          goToFirstMove();
          break;
        case "1":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.BRILLIANT,
          });
          break;
        case "2":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.GOOD,
          });
          break;
        case "3":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.INTERESTING,
          });
          break;
        case "4":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.NEUTRAL,
          });
          break;
        case "5":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.DUBIOUS,
          });
          break;
        case "6":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.BAD,
          });
          break;
        case "7":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.BLUNDER,
          });
          break;
        case "8":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.NONE,
          });
          break;
        case "9":
          repertoireSettingsStore.upsertSettings({
            annotationSetting: ANNOTATION_SETTINGS.DONT_SAVE,
          });
          break;
        case "f":
          repertoireSettingsStore.flipBoard();
          break;
        case "e":
          exportRepertoire();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToFirstMove, goToPreviousMove, goToNextMove, goToLastMove]);
};
