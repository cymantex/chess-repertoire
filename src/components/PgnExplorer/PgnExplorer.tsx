import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";
import { PgnTr } from "@/components/PgnExplorer/PgnTr.tsx";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectPgn } from "@/stores/zustand/selectors.ts";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { FaCopy } from "react-icons/fa";
import { makePgn } from "chessops/pgn";
import { toast } from "react-toastify";

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
          <div className="flex justify-between pr-6">
            <span>PGN</span>
            <IconButton
              title="Copy PGN"
              className="text-base-content transition-all hover:scale-125"
              onClick={copyPgn}
            >
              <FaCopy />
            </IconButton>
          </div>
          {toggleButton}
        </td>
      )}
      section={TOGGLE_SECTIONS.PGN_EXPLORER}
      renderChildren={(collapsed) => (!collapsed ? <PgnTr /> : null)}
    />
  );
};
