import { ReactElement, ReactNode, useSyncExternalStore } from "react";
import { LoadingModal } from "@/common/components/Modal/LoadingModal.tsx";
import {
  ConfirmModal,
  Props,
} from "@/common/components/Modal/ConfirmModal.tsx";

import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

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
      isReactElement(modal) ? modal.props.id !== id : true,
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
