import { OpeningExplorerTbody } from "@/components/RepertoireSidebar/components/OpeningExplorer/OpeningExplorerTbody.tsx";
import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";

export const OpeningExplorerTable = () => {
  return (
    <AccordingTable
      section={TOGGLE_SECTIONS.OPENING_EXPLORER}
      renderTheadTrChildren={(toggleButton) => (
        <>
          <td>Move</td>
          <td>Games</td>
          <td>
            <span>Annotation</span>
            {toggleButton}
          </td>
        </>
      )}
      className="table-sm table-zebra select-none"
      renderChildren={(collapsed) =>
        !collapsed ? <OpeningExplorerTbody /> : null
      }
    />
  );
};
