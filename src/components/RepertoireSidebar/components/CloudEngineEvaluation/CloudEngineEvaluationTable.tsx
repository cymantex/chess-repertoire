import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";
import { CloudEngineEvaluationTbody } from "@/components/RepertoireSidebar/components/CloudEngineEvaluation/CloudEngineEvaluationTbody.tsx";

export const CloudEngineEvaluationTable = () => (
  <AccordingTable
    section={TOGGLE_SECTIONS.CLOUD_ENGINE_EVALUATION}
    renderTheadTrChildren={(toggleButton) => (
      <td>
        <span>Cloud engine evaluation</span>
        {toggleButton}
      </td>
    )}
    renderChildren={(collapsed) =>
      !collapsed ? <CloudEngineEvaluationTbody /> : null
    }
  />
);
