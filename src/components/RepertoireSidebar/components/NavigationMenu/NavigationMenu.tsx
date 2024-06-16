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
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
import { SIDEBARS } from "@/defs.ts";
import classNames from "classnames";
import { hasNextMove } from "@/external/chessops/pgn.ts";

export const NavigationMenu = () => {
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
    !!pendingPromotionMove || chess.history().length <= 0;
  const nextMoveDisabled =
    !!pendingPromotionMove || !hasNextMove(pgn, chess.history());

  // TODO: Extract component for buttons
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
      <button
        className={classNames({
          "text-base-300": previousMoveDisabled,
        })}
        disabled={previousMoveDisabled}
        onClick={goToFirstMove}
      >
        <FaFastBackward />
      </button>
      <button
        className={classNames({
          "text-base-300": previousMoveDisabled,
        })}
        disabled={previousMoveDisabled}
        onClick={goToPreviousMove}
      >
        <FaStepBackward />
      </button>
      <button
        className={classNames({
          "text-base-300": nextMoveDisabled,
        })}
        disabled={nextMoveDisabled}
        onClick={goToNextMove}
      >
        <FaStepForward />
      </button>
      <button
        className={classNames({
          "text-base-300": nextMoveDisabled,
        })}
        disabled={nextMoveDisabled}
        onClick={goToLastMove}
      >
        <FaFastForward />
      </button>
      <button onClick={rotate}>
        <FaRotate title="Flip board" />
      </button>
      <button
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
      </button>
    </div>
  );
};
