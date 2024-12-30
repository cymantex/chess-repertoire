import { useModalStore } from "@/common/components/Modal/modalStore.tsx";

export const ModalContainer = () => {
  const modals = useModalStore();

  return (
    <div className="modal-container">
      {modals.map((modal, i) => (
        <div key={i}>{modal}</div>
      ))}
    </div>
  );
};
