import { FaArrowRightToBracket, FaRotate } from "react-icons/fa6";
import {
  FaFastBackward,
  FaFastForward,
  FaSlidersH,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import {
  selectChess,
  selectFen,
  selectPgn,
  useRepertoireStore,
} from "@/app/zustand/store.ts";
import { AnnotationSettings } from "@/features/annotations/AnnotationSettings.tsx";
import {
  repertoireSettingsStore,
  useRepertoireSettings,
} from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import classNames from "classnames";
import { hasNextMove } from "@/external/chessops/pgn.ts";
import { IconButton } from "@/common/components/IconButton.tsx";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
} from "@/features/navigation/navigationSlice.ts";
import { selectPendingPromotionMove } from "@/features/chessboard/chessboardSlice.ts";
import { SIDEBAR_IDS } from "@/features/sidebar/defs.ts";
import {
  selectOpenSidebar,
  selectSidebarId,
  selectToggleSidebar,
} from "@/features/sidebar/sidebarSlice.ts";
import { isMobileSize } from "@/common/utils/utils.ts";

export const NavigationMenu = () => {
  const fen = useRepertoireStore(selectFen);
  const chess = useRepertoireStore(selectChess);
  const pgn = useRepertoireStore(selectPgn);
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);
  const sidebarId = useRepertoireStore(selectSidebarId);
  const openSidebar = useRepertoireStore(selectOpenSidebar);
  const toggleSidebar = useRepertoireStore(selectToggleSidebar);
  const { annotationSetting } = useRepertoireSettings();

  const previousMoveDisabled =
    !fen || !!pendingPromotionMove || chess.history().length <= 0;
  const nextMoveDisabled =
    !fen || !!pendingPromotionMove || !hasNextMove(pgn, chess.history());

  return (
    <nav className="p-2 flex items-start justify-evenly text-2xl">
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
      <IconButton onClick={() => repertoireSettingsStore.flipBoard()}>
        <Tooltip className="w-20 max-w-20" tooltip="Flip board (hotkey: f)">
          <FaRotate />
        </Tooltip>
      </IconButton>

      <IconButton
        className={classNames("cursor-pointer", {
          "text-primary": sidebarId === SIDEBAR_IDS.SETTINGS,
        })}
        onClick={() => {
          openSidebar(
            sidebarId === SIDEBAR_IDS.OPENING_EXPLORER
              ? SIDEBAR_IDS.SETTINGS
              : SIDEBAR_IDS.OPENING_EXPLORER,
          );
        }}
      >
        <Tooltip tooltip="Settings">
          <FaSlidersH />
        </Tooltip>
      </IconButton>
      {!isMobileSize() && (
        <IconButton onClick={toggleSidebar}>
          <Tooltip tooltip="Collapse">
            <FaArrowRightToBracket />
          </Tooltip>
        </IconButton>
      )}
    </nav>
  );
};
