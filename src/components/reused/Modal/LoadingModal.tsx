import { ReactNode } from "react";
import { Modal } from "@/components/reused/Modal/Modal.tsx";

interface LoadingModalProps {
  id: string;
  show: boolean;
  children: ReactNode;
}

export const LoadingModal = ({ id, children, show }: LoadingModalProps) => (
  <Modal id={id} className="text-center" show={show}>
    <Modal.Title>{children}</Modal.Title>
    <span className="loading loading-spinner w-36"></span>
  </Modal>
);
