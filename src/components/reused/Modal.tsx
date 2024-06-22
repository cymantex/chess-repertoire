import classNames from "classnames";
import { HTMLAttributes, ReactNode } from "react";

interface ModalProps {
  show: boolean;
  children: ReactNode;
}

export const Modal = ({ show, children }: ModalProps) => (
  <dialog
    className={classNames("modal", {
      "modal-open": show,
    })}
  >
    <div className="modal-box">{children}</div>
  </dialog>
);

interface ModalCloseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
}

Modal.CloseButton = (props: ModalCloseButtonProps) => (
  <button
    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    {...props}
  >
    ✕
  </button>
);

Modal.Title = ({ children }: { children: ReactNode }) => (
  <h3 className="font-bold text-lg mb-5">{children}</h3>
);
