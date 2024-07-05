import {
  repertoireSettingsStore,
  useRepertoireSettings,
} from "@/stores/repertoireSettingsStore.ts";
import { useStockfish } from "@/stockfish/useStockfish.ts";
import { head } from "lodash";
import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";
import { ChessEngineAnalysisThead } from "@/components/RepertoireSidebar/ChessEngineAnalysis/ChessEngineAnalysisThead.tsx";
import { ChessEngineAnalysisTbody } from "@/components/RepertoireSidebar/ChessEngineAnalysis/ChessEngineAnalysisTbody.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { registerCoiServiceWorker } from "@/external/coi/coi.ts";
import { openDefaultErrorToast } from "@/external/react-toastify/toasts.ts";

export const ChessEngineAnalysis = () => {
  const { engineSettings } = useRepertoireSettings();
  const { multiPv } = engineSettings;
  const { analysisState, toggleAnalysis, analysisResults, changeMultiPv } =
    useStockfish(engineSettings);
  const firstResult = head(analysisResults);

  const handleMultiPvChange = (multiPv: number) => {
    if (multiPv < 1 || multiPv > 10) return;
    repertoireSettingsStore.upsertEngineSettings({ multiPv });
    return changeMultiPv(multiPv);
  };

  return (
    <AccordingTable
      className="table-xs"
      section={TOGGLE_SECTIONS.CHESS_ENGINE_ANALYSIS}
      renderTheadTrChildren={(toggleButton) => (
        <ChessEngineAnalysisThead
          analysisState={analysisState}
          onChange={async () => {
            if (!window.crossOriginIsolated) {
              modalStore.addConfirmModal({
                children: (
                  <>
                    <p>
                      Stockfish requires cross-origin isolation to be enabled.
                    </p>
                    <p>Do you want to refresh the page to enable it?</p>
                  </>
                ),
                onConfirm: registerCoiServiceWorker,
              });
              return;
            }

            try {
              await toggleAnalysis();
            } catch (error) {
              openDefaultErrorToast(error);
            }
          }}
          result={firstResult}
          onAddLine={() => handleMultiPvChange(multiPv + 1)}
          onRemoveLine={() => handleMultiPvChange(multiPv - 1)}
        >
          {toggleButton}
        </ChessEngineAnalysisThead>
      )}
      renderChildren={(collapsed) =>
        !collapsed ? (
          <ChessEngineAnalysisTbody
            analysisResults={analysisResults}
            analysisState={analysisState}
          />
        ) : null
      }
    />
  );
};
