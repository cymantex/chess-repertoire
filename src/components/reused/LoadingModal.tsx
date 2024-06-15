import classNames from "classnames";
import { ReactNode } from "react";

interface LoadingModalProps {
  show: boolean;
  children: ReactNode;
}

export const LoadingModal = ({ children, show }: LoadingModalProps) => (
  <dialog
    className={classNames("modal", {
      "modal-open": show,
    })}
  >
    <div className="modal-box text-center">
      <h2 className="font-bold text-2xl mb-5">{children}</h2>
      <span className="loading loading-spinner w-36"></span>
    </div>
  </dialog>
);
