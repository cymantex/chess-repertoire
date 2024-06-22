import classNames from "classnames";
import { ReactNode } from "react";

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
  <dialog
    className={classNames("modal", {
      "modal-open": show,
    })}
  >
    <div className="modal-box text-center">
      <h2 className="font-bold text-2xl mb-5">{children}</h2>
      <button className="btn mr-2" onClick={onConfirm}>
        Yes
      </button>
      <button autoFocus className="btn btn-secondary" onClick={onCancel}>
        No
      </button>
    </div>
  </dialog>
);
