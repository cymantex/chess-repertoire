import { useGoogleLogin } from "@react-oauth/google";
import {
  Credential,
  googleCredentialStore,
} from "@/stores/googleCredentialStore.ts";
import { modalStore } from "@/stores/modalStore.tsx";
import { MODAL_IDS } from "@/defs.ts";
import {
  hasMessage,
  openErrorToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import {
  deregisterCoiServiceWorker,
  isCoiServiceWorkerRegistered,
} from "@/utils/coi.ts";
import { googleDriveApi } from "@/google/googleDriveApi.ts";
import { useCallback } from "react";

export const hasExpired = (
  credential: Pick<Credential, "issued_at" | "expires_in">,
) => Date.now() - credential.issued_at > credential.expires_in * 1000;

export const useGoogleDriveLogin = () => {
  const login = useGoogleLogin({
    onSuccess: async (credential) => {
      // Removing a minute since we don't know the exact time the token was
      // issued, it's better if it expires a bit earlier rather than an
      // expired token being used.
      const issuedAt = Date.now() - 60 * 1000;

      const email = await googleDriveApi.fetchEmail(credential.access_token);
      googleCredentialStore.upsertCredential({
        ...credential,
        email,
        issued_at: issuedAt,
      });
      modalStore.closeModal(MODAL_IDS.LOADING);
      openSuccessToast(
        `Logged into Google Drive as ${email}, ` +
          `you can now upload or download your repertoire.`,
      );
    },
    onError: (error) => {
      console.error(error);
      handleLoginError({
        type: error.error!,
        message: error.error_description!,
      });
    },
    onNonOAuthError: (error) => {
      console.error(error);

      if (hasMessage(error)) {
        handleLoginError({ type: error.type, message: error.message });
      } else {
        handleLoginError({
          type: error.type,
          message: "",
        });
      }
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  const handleLoginError = ({
    type,
    message,
  }: {
    type: string;
    message: string;
  }) => {
    modalStore.closeModal(MODAL_IDS.LOADING);
    openErrorToast(`Login to Google failed (${type}: ${message})`);
  };

  return useCallback(async () => {
    if (await isCoiServiceWorkerRegistered()) {
      showConfirmDeregisterCoiWorkerModal();
      return;
    }

    modalStore.setLoadingModal("Logging into Google");
    login();
  }, [login]);
};

const showConfirmDeregisterCoiWorkerModal = () =>
  modalStore.addConfirmModal({
    children: (
      <>
        <p>
          Google login requires <pre>cross-origin isolation</pre> to be
          disabled.
        </p>
        <p className="mt-2 font-light">
          A page refresh is required to disable it.
        </p>
        <p className="font-light">Do you want to continue?</p>
        <p className="mt-4 text-success text-sm">
          The current PGN and FEN will be saved
        </p>
      </>
    ),
    onConfirm: deregisterCoiServiceWorker,
  });
