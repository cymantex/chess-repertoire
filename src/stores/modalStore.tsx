import { ReactNode, useSyncExternalStore } from "react";
import { LoadingModal } from "@/components/reused/Modal/LoadingModal.tsx";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/reused/Modal/ConfirmModal.tsx";

const subscribers = new Set<() => void>();
const notifySubscribers = () => subscribers.forEach((callback) => callback());
let currentModal: ReactNode = null;

export const modalStore = {
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  getModalSnapshot: (): ReactNode => {
    return currentModal;
  },
  showConfirmModal: ({
    children,
    ...props
  }: Pick<ConfirmModalProps, "onConfirm"> & Partial<ConfirmModalProps>) =>
    modalStore.setModal(
      <ConfirmModal show onCancel={modalStore.closeModal} {...props}>
        {children}
      </ConfirmModal>,
    ),
  showLoadingModal: (children: ReactNode) =>
    modalStore.setModal(<LoadingModal show>{children}</LoadingModal>),
  setModal: (modal: ReactNode) => {
    currentModal = modal;
    notifySubscribers();
  },
  closeModal: () => {
    currentModal = null;
    notifySubscribers();
  },
};

export const useModalStore = () =>
  useSyncExternalStore(modalStore.subscribe, modalStore.getModalSnapshot);
