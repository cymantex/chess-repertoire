import { ReactNode } from "react";
import { Modal } from "@/components/reused/Modal/Modal.tsx";

export interface ConfirmModalProps {
  show: boolean;
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  children,
  show,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <Modal className="text-center" show={show}>
    <Modal.Title>{children}</Modal.Title>
    <button className="btn mr-2" onClick={onConfirm}>
      Yes
    </button>
    <button autoFocus className="btn btn-secondary" onClick={onCancel}>
      No
    </button>
  </Modal>
);
