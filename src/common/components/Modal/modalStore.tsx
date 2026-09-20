import type { ReactElement, ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { LoadingModal } from "@/common/components/Modal/LoadingModal.tsx";
import type { Props } from "@/common/components/Modal/ConfirmModal.tsx";
import { ConfirmModal } from "@/common/components/Modal/ConfirmModal.tsx";

import { MODAL_IDS } from "@/common/components/Modal/defs.ts";
import type { ModalId } from "@/common/components/Modal/Modal.tsx";
import { Modal } from "@/common/components/Modal/Modal.tsx";
import { CommentEditorContainer } from "@/features/comment-editor/CommentEditorContainer.tsx";

const subscribers = new Set<() => void>();
const notifySubscribers = () => subscribers.forEach((callback) => callback());
let currentModals: ReactNode[] = [];

export const modalStore = {
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  getModalsSnapshot: (): ReactNode[] => {
    return currentModals;
  },
  addConfirmModal: ({
    children,
    onConfirm,
    ...props
  }: Pick<Props, "onConfirm"> & Partial<Props>) =>
    modalStore.addModal(
      <ConfirmModal
        id={MODAL_IDS.CONFIRM}
        show
        onCancel={() => modalStore.closeModal(MODAL_IDS.CONFIRM)}
        onConfirm={() => {
          onConfirm();
          modalStore.closeModal(MODAL_IDS.CONFIRM);
        }}
        {...props}
      >
        {children}
      </ConfirmModal>,
    ),
  addLoadingModal: (children: ReactNode) =>
    modalStore.addModal(
      <LoadingModal id={MODAL_IDS.LOADING} show>
        {children}
      </LoadingModal>,
    ),
  setLoadingModal: (children: ReactNode) =>
    modalStore.setModal(
      <LoadingModal id={MODAL_IDS.LOADING} show>
        {children}
      </LoadingModal>,
    ),
  addCommentModal: () =>
    modalStore.addModal(
      <Modal id={MODAL_IDS.COMMENT} show>
        <CommentEditorContainer style={{ height: "250px" }} />
        <button
          className="btn btn-sm btn-secondary mt-4"
          onClick={() => modalStore.closeModal(MODAL_IDS.COMMENT)}
        >
          Close
        </button>
      </Modal>,
    ),
  setModal: (modal: ReactNode) => {
    currentModals = [modal];
    notifySubscribers();
  },
  addModal: (modal: ReactNode) => {
    currentModals = [...currentModals, modal];
    notifySubscribers();
  },
  closeModal: (id: string) => {
    currentModals = currentModals.filter((modal) =>
      isReactElement(modal) ? (modal.props as ModalId).id !== id : true,
    );
    notifySubscribers();
  },
  closeAllModals: () => {
    currentModals = [];
    notifySubscribers();
  },
};

export const useModalStore = () =>
  useSyncExternalStore(modalStore.subscribe, modalStore.getModalsSnapshot);

const isReactElement = (element: ReactNode): element is ReactElement =>
  !!element && typeof element === "object" && "props" in element;
