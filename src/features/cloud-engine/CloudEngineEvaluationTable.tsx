import { TOGGLE_SECTIONS } from "@/features/repertoire/defs.ts";
import { AccordionTable } from "@/common/components/AccordionTable/AccordionTable.tsx";
import { CloudEngineEvaluationTbody } from "@/features/cloud-engine/CloudEngineEvaluationTbody.tsx";
import { selectFen, useRepertoireStore } from "@/app/zustand/store.ts";

export const CloudEngineEvaluationTable = () => {
  const fen = useRepertoireStore(selectFen);

  return (
    <AccordionTable
      className="table-xs"
      section={TOGGLE_SECTIONS.CLOUD_ENGINE_EVALUATION}
      renderTheadTrChildren={(toggleButton) => (
        <td>
          <span>Cloud engine evaluation</span>
          {toggleButton}
        </td>
      )}
      renderChildren={(collapsed) =>
        !collapsed ? <CloudEngineEvaluationTbody key={fen} /> : null
      }
    />
  );
};
