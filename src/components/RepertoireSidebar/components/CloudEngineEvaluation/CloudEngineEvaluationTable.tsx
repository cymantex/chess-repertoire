import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";
import { CloudEngineEvaluationTbody } from "@/components/RepertoireSidebar/components/CloudEngineEvaluation/CloudEngineEvaluationTbody.tsx";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectFen } from "@/stores/zustand/selectors.ts";

export const CloudEngineEvaluationTable = () => {
  const fen = useRepertoireStore(selectFen);

  return (
    <AccordingTable
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
