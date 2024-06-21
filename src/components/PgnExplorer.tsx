import { selectPgn } from "@/stores/zustand/selectors.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { toPgn } from "@/external/chessops/pgn.ts";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";
import { AccordingTable } from "@/components/reused/AccordingTable.tsx";
import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";

export const PgnExplorer = () => {
  const pgn = useRepertoireStore(selectPgn);

  return (
    <HideOnMobile>
      <AccordingTable
        renderTheadTrChildren={(toggleButton) => (
          <td>
            <span>PGN</span>
            {toggleButton}
          </td>
        )}
        section={TOGGLE_SECTIONS.PGN_EXPLORER}
      >
        <tr>
          <td>{toPgn(pgn)}</td>
        </tr>
      </AccordingTable>
    </HideOnMobile>
  );
};
