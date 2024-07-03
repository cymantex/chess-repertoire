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
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
import { SIDEBARS } from "@/defs.ts";
import classNames from "classnames";
import { hasNextMove } from "@/external/chessops/pgn.ts";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import {
  deregisterCoiServiceWorker,
  isCoiServiceWorkerRegistered,
} from "../../../../_assets/coi.ts";
import { modalStore } from "@/stores/modalStore.tsx";
import { startExportRepertoireAsStringWorker } from "@/repertoire/repertoireIo.ts";

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

  const login = useGoogleLogin({
    onSuccess: async (credential) => {
      const accessToken = credential.access_token;
      console.log(credential);

      // TODO: Update if exists
      const repertoireJson = await startExportRepertoireAsStringWorker();
      const uploadParams = await fetch(
        "https://www.googleapis.com/drive/v3/files?uploadType=resumable",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "repertoire.json",
            mimeType: "application/json",
          }),
        },
      ).then((response) => {
        console.log(response);
        // TODO: Handle error
        return response.json();
      });

      const response = await fetch(
        `/upload/drive/v3/files` +
          `?uploadType=resumable&upload_id=${uploadParams.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Upload-Content-Type": "application/json",
            "Content-Type": "application/json",
            "Content-Length": `${new TextEncoder().encode(repertoireJson).length}`,
          },
          body: repertoireJson,
        },
      );

      console.log(response);
    },
    onError: console.error,
    onNonOAuthError: (error) => {
      console.error(error);
      toast.error(
        // @ts-ignore
        `Upload to google drive failed (${error.type}: ${error.message})`,
      );
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  const handleUploadToGoogleDrive = async () => {
    // TODO: Only check if access_token doesn't exist?
    const registered = await isCoiServiceWorkerRegistered();

    if (registered) {
      modalStore.addConfirmModal({
        children: (
          <>
            <p>
              Cannot upload to google drive as cross-origin isolation is
              currently enabled.
            </p>
            <p>A page refresh is required to disable it.</p>
            <p>Do you want to continue?</p>
          </>
        ),
        onConfirm: deregisterCoiServiceWorker,
      });
    } else {
      modalStore.setLoadingModal("Uploading repertoire to Google Drive...");
      login();
    }
  };

  const previousMoveDisabled =
    !fen || !!pendingPromotionMove || chess.history().length <= 0;
  const nextMoveDisabled =
    !fen || !!pendingPromotionMove || !hasNextMove(pgn, chess.history());

  return (
    <nav className="flex justify-evenly text-2xl">
      <AnnotationSettings
        annotationSetting={annotationSetting}
        onSelect={(annotationSetting) =>
          localStorageStore.upsertSettings({
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
