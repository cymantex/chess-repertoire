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
import { SIDEBARS } from "@/defs.ts";
import classNames from "classnames";
import { hasNextMove } from "@/external/chessops/pgn.ts";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";

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

  const previousMoveDisabled =
    !fen || !!pendingPromotionMove || chess.history().length <= 0;
  const nextMoveDisabled =
    !fen || !!pendingPromotionMove || !hasNextMove(pgn, chess.history());

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
        <Tooltip className="w-20 max-w-20" tooltip="Flip board (hotkey: f)">
          <FaRotate />
        </Tooltip>
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
        <Tooltip tooltip="Settings">
          <FaSlidersH />
        </Tooltip>
      </IconButton>
    </nav>
  );
};
