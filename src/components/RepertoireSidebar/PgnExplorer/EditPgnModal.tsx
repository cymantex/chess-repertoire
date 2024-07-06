import { Modal, ModalId } from "@/components/reused/Modal/Modal.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { selectPgn, selectSavePgn } from "@/stores/zustand/selectors.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { useState } from "react";
import { makePgn } from "chessops/pgn";
import { openDefaultErrorToast } from "@/external/react-toastify/toasts.ts";

export const EditPgnModal = ({ id }: ModalId) => {
  const currentPgn = useRepertoireStore(selectPgn);
  const savePgn = useRepertoireStore(selectSavePgn);

  const [pgn, setPgn] = useState<string>(makePgn(currentPgn));

  const handleSavePgn = async () => {
    try {
      await savePgn(pgn);
      modalStore.closeModal(id);
    } catch (error) {
      openDefaultErrorToast(error);
    }
  };

  return (
    <Modal id={id} className="max-w-2xl" show>
      <Modal.CloseButton onClick={() => modalStore.closeModal(id)} />
      <Modal.Title>Edit PGN</Modal.Title>
      <textarea
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
        className="textarea textarea-bordered w-full"
        rows={15}
      />
      <div className="modal-action">
        <button className="btn btn-primary" onClick={handleSavePgn}>
          Save
        </button>
      </div>
    </Modal>
  );
};
