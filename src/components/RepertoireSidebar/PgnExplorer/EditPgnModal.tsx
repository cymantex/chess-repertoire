import { Modal, ModalId } from "@/components/reused/Modal/Modal.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import {
  selectFen,
  selectPgn,
  selectSavePgn,
} from "@/stores/zustand/selectors.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { useState } from "react";
import { makePgn } from "chessops/pgn";
import {
  openDefaultErrorToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import { FaCopy } from "react-icons/fa";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";

export const EditPgnModal = ({ id }: ModalId) => {
  const fen = useRepertoireStore(selectFen);
  const currentPgn = useRepertoireStore(selectPgn);
  const savePgn = useRepertoireStore(selectSavePgn);

  const [pgn, setPgn] = useState<string>(makePgn(currentPgn));

  const copyFen = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      openSuccessToast("FEN copied to clipboard");
    } catch (error) {
      openDefaultErrorToast(error);
    }
  };

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
      <div className="border border-primary mb-4 text-sm flex">
        <div className="p-2 border-r border-primary">Current FEN</div>
        <div
          className={
            "flex-1 whitespace-nowrap overflow-x-auto p-2 " +
            "text-base-content/50 border-r border-primary"
          }
        >
          {fen}
        </div>
        <div className="p-2 flex items-center justify-center flex-grow-0">
          <Tooltip tooltip="Copy">
            <IconButton onClick={copyFen}>
              <FaCopy />
            </IconButton>
          </Tooltip>
        </div>
      </div>

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
