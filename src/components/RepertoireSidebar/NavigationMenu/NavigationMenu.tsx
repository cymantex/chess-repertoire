import { FaRotate } from "react-icons/fa6";
import {
  FaCloudUploadAlt,
  FaFastBackward,
  FaFastForward,
  FaSlidersH,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectChess,
  selectFen,
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
  selectOpenSidebar,
  selectPendingPromotionMove,
  selectPgn,
  selectRotate,
  selectSidebar,
} from "@/stores/zustand/selectors.ts";
import { AnnotationSettings } from "@/components/reused/AnnotationSettings.tsx";
import {
  repertoireSettingsStore,
  useRepertoireSettings,
} from "@/stores/repertoireSettingsStore.ts";
import { MODAL_IDS, SIDEBARS } from "@/defs.ts";
import classNames from "classnames";
import { hasNextMove } from "@/external/chessops/pgn.ts";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { toast } from "react-toastify";
import { modalStore } from "@/stores/modalStore.tsx";
import { useGoogleDrive } from "@/google/useGoogleDrive.tsx";

export const NavigationMenu = () => {
  const fen = useRepertoireStore(selectFen);
  const rotate = useRepertoireStore(selectRotate);
  const chess = useRepertoireStore(selectChess);
  const pgn = useRepertoireStore(selectPgn);
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);
  const sidebar = useRepertoireStore(selectSidebar);
  const openSidebar = useRepertoireStore(selectOpenSidebar);
  const { annotationSetting } = useRepertoireSettings();

  // TODO: Let this fully handle the login behavior
  const { handleUploadToGoogleDrive } = useGoogleDrive(() => {
    modalStore.closeModal(MODAL_IDS.LOADING);
    toast.success(
      "Logged into Google Drive, you can now upload or download your repertoire.",
    );
  });

  const previousMoveDisabled =
    !fen || !!pendingPromotionMove || chess.history().length <= 0;
  const nextMoveDisabled =
    !fen || !!pendingPromotionMove || !hasNextMove(pgn, chess.history());

  // TODO: hotkeys
  return (
    <nav className="flex justify-evenly text-2xl">
      <AnnotationSettings
        annotationSetting={annotationSetting}
        onSelect={(annotationSetting) =>
          repertoireSettingsStore.upsertSettings({
            annotationSetting,
          })
        }
      />
      <IconButton disabled={previousMoveDisabled} onClick={goToFirstMove}>
        <FaFastBackward />
      </IconButton>
      <IconButton disabled={previousMoveDisabled} onClick={goToPreviousMove}>
        <FaStepBackward />
      </IconButton>
      <IconButton disabled={nextMoveDisabled} onClick={goToNextMove}>
        <FaStepForward />
      </IconButton>
      <IconButton disabled={nextMoveDisabled} onClick={goToLastMove}>
        <FaFastForward />
      </IconButton>
      <IconButton onClick={rotate}>
        <FaRotate title="Flip board (hotkey: f)" />
      </IconButton>
      <IconButton onClick={handleUploadToGoogleDrive}>
        <FaCloudUploadAlt title="Upload repertoire to cloud (hotkey: u)" />
      </IconButton>
      <IconButton
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
      >
        <FaSlidersH />
      </IconButton>
    </nav>
  );
};
