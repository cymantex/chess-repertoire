import { selectPgn } from "@/stores/zustand/selectors.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { toPgn } from "@/external/chessops/pgn.ts";
import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";

export const PgnExplorer = () => {
  const pgn = useRepertoireStore(selectPgn);

  return (
    <AccordingTable
      renderTheadTrChildren={(toggleButton) => (
        <td>
          <span>PGN</span>
          {toggleButton}
        </td>
      )}
      section={TOGGLE_SECTIONS.PGN_EXPLORER}
      renderChildren={(collapsed) =>
        !collapsed ? (
          <tr className="font-chess">
            <td>{toPgn(pgn)}</td>
          </tr>
        ) : null
      }
    />
  );
};
