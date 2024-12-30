import classNames from "classnames";
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface ModalId {
  id: string;
}

export interface ModalProps extends HTMLAttributes<HTMLDialogElement> {
  show: boolean;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ show, children, className, ...props }: ModalProps) => (
  <dialog
    className={classNames("modal", {
      "modal-open": show,
    })}
    {...props}
  >
    <div className={classNames("modal-box", className)}>{children}</div>
  </dialog>
);

export interface ModalCloseButtonProps
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
