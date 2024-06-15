import { FaRotate } from "react-icons/fa6";
import {
  FaFastBackward,
  FaFastForward,
  FaSlidersH,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
  selectOpenSidebar,
  selectRotate,
  selectSidebar,
} from "@/stores/zustand/selectors.ts";
import { AnnotationSettings } from "@/components/reused/AnnotationSettings.tsx";
import {
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
import { SIDEBARS } from "@/defs.ts";
import classNames from "classnames";

export const NavigationMenu = () => {
  const rotate = useRepertoireStore(selectRotate);
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);
  const sidebar = useRepertoireStore(selectSidebar);
  const openSidebar = useRepertoireStore(selectOpenSidebar);
  const { annotationSetting } = useRepertoireSettings();

  // TODO: Disable buttons not available to click
  return (
    <div className="flex justify-evenly text-2xl">
      <AnnotationSettings
        annotationSetting={annotationSetting}
        onSelect={(annotationSetting) =>
          localStorageStore.upsertSettings({
            annotationSetting,
          })
        }
      />
      <FaFastBackward className="cursor-pointer" onClick={goToFirstMove} />
      <FaStepBackward className="cursor-pointer" onClick={goToPreviousMove} />
      <FaStepForward className="cursor-pointer" onClick={goToNextMove} />
      <FaFastForward className="cursor-pointer" onClick={goToLastMove} />
      <FaRotate
        title="Flip board"
        className="cursor-pointer"
        onClick={rotate}
      />
      <FaSlidersH
        className={classNames("cursor-pointer", {
          "text-primary": sidebar === SIDEBARS.SETTINGS,
        })}
        onClick={() => {
          openSidebar(
            sidebar === SIDEBARS.OPENING_EXPLORER
              ? SIDEBARS.SETTINGS
              : SIDEBARS.OPENING_EXPLORER,
          );
        }}
      />
    </div>
  );
};
