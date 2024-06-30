import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";
import { PgnTr } from "@/components/RepertoireSidebar/PgnExplorer/PgnTr.tsx";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectPgn } from "@/stores/zustand/selectors.ts";
import { FaCopy, FaEdit } from "react-icons/fa";
import { makePgn } from "chessops/pgn";
import { toast } from "react-toastify";
import { ThMenu } from "@/components/reused/ThMenu/ThMenu.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { EditPgnModal } from "@/components/RepertoireSidebar/PgnExplorer/EditPgnModal.tsx";
import { MODAL_IDS } from "@/defs.ts";

export const PgnExplorer = () => {
  const pgn = useRepertoireStore(selectPgn);

  const copyPgn = async () => {
    try {
      await navigator.clipboard.writeText(makePgn(pgn));
      toast.success("PGN copied to clipboard");
    } catch (e) {
      // @ts-ignore
      toast.error(e.message);
    }
  };

  return (
    <AccordingTable
      renderTheadTrChildren={(toggleButton) => (
        <td>
          <ThMenu.Container>
            <span>PGN</span>
            <ThMenu>
              <ThMenu.Item>
                <ThMenu.IconButton title="Copy PGN" onClick={copyPgn}>
                  <FaCopy />
                </ThMenu.IconButton>
              </ThMenu.Item>
              <ThMenu.Item>
                <ThMenu.IconButton
                  title="Edit PGN"
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
