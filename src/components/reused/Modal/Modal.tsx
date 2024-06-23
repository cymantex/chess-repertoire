import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

interface ModalProps {
  show: boolean;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ show, children, className }: ModalProps) => (
  <dialog
    className={classNames("modal", {
      "modal-open": show,
    })}
  >
    <div className={classNames("modal-box", className)}>{children}</div>
  </dialog>
);

interface ModalCloseButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "onClick"
  > {
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
  <h2 className="font-bold text-lg mb-5">{children}</h2>
);
