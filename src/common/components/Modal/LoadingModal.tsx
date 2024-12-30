import type { ReactNode } from "react";
import { Modal } from "@/common/components/Modal/Modal.tsx";

interface Props {
  id: string;
  show: boolean;
  children: ReactNode;
}

export const LoadingModal = ({ id, children, show }: Props) => (
  <Modal id={id} className="text-center" show={show}>
    <Modal.Title>{children}</Modal.Title>
    <span className="loading loading-spinner w-36"></span>
  </Modal>
);
