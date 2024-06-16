import { useModalStore } from "@/stores/modalStore.tsx";

export const ModalContainer = () => {
  const modal = useModalStore();

  return <div className="modal-container">{modal}</div>;
};
