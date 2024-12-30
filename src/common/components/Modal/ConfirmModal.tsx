import { Modal, ModalProps } from "@/common/components/Modal/Modal.tsx";

export interface ConfirmModalProps extends ModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  children,
  show,
  onConfirm,
  onCancel,
  ...props
}: ConfirmModalProps) => (
  <Modal className="text-center" show={show} {...props}>
    <Modal.Title>{children}</Modal.Title>
    <button autoFocus className="btn mr-2" onClick={onConfirm}>
      Yes
    </button>
    <button className="btn btn-secondary" onClick={onCancel}>
      No
    </button>
  </Modal>
);
