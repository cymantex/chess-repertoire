import { TOGGLE_SECTIONS } from "@/features/repertoire/defs.ts";
import { AccordionTable } from "@/common/components/AccordionTable/AccordionTable.tsx";
import { PgnTr } from "@/features/pgn/explorer/PgnTr.tsx";
import { selectPgn, useRepertoireStore } from "@/app/zustand/store.ts";
import { FaCopy, FaEdit } from "react-icons/fa";
import { makePgn } from "chessops/pgn";
import { ThMenu } from "@/common/components/ThMenu/ThMenu.tsx";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { EditPgnModal } from "@/features/pgn/explorer/EditPgnModal.tsx";
import {
  openDefaultErrorToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

export const PgnExplorer = () => {
  const pgn = useRepertoireStore(selectPgn);

  const copyPgn = async () => {
    try {
      await navigator.clipboard.writeText(makePgn(pgn));
      openSuccessToast("PGN copied to clipboard");
    } catch (error) {
      openDefaultErrorToast(error);
    }
  };

  return (
    <AccordionTable
      renderTheadTrChildren={(toggleButton) => (
        <td>
          <ThMenu.Container>
            <span>PGN</span>
            <ThMenu>
              <ThMenu.Item>
                <ThMenu.IconButton title="Copy" onClick={copyPgn}>
                  <FaCopy />
                </ThMenu.IconButton>
              </ThMenu.Item>
              <ThMenu.Item>
                <ThMenu.IconButton
                  title="Edit"
                  onClick={() =>
                    modalStore.setModal(
                      <EditPgnModal id={MODAL_IDS.EDIT_PGN_MODAL} />,
                    )
                  }
                >
                  <FaEdit />
                </ThMenu.IconButton>
              </ThMenu.Item>
            </ThMenu>
          </ThMenu.Container>
          {toggleButton}
        </td>
      )}
      section={TOGGLE_SECTIONS.PGN_EXPLORER}
      renderChildren={(collapsed) => (!collapsed ? <PgnTr /> : null)}
    />
  );
};
