import { useModalStore } from "@/stores/modalStore.tsx";

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
