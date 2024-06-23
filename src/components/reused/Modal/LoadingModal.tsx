import { ReactNode } from "react";
import { Modal } from "@/components/reused/Modal/Modal.tsx";

interface LoadingModalProps {
  show: boolean;
  children: ReactNode;
}

export const LoadingModal = ({ children, show }: LoadingModalProps) => (
  <Modal className="text-center" show={show}>
    <Modal.Title>{children}</Modal.Title>
    <span className="loading loading-spinner w-36"></span>
  </Modal>
);
