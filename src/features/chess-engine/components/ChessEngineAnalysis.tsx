import {
  repertoireSettingsStore,
  useRepertoireSettings,
} from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { useStockfish } from "@/features/chess-engine/stockfish/useStockfish.ts";
import { head } from "lodash";
import { TOGGLE_SECTIONS } from "@/features/repertoire/defs.ts";
import { AccordingTable } from "@/common/components/AccordionTable/AccordingTable.tsx";
import { ChessEngineAnalysisThead } from "@/features/chess-engine/components/ChessEngineAnalysisThead.tsx";
import { ChessEngineAnalysisTbody } from "@/features/chess-engine/components/ChessEngineAnalysisTbody.tsx";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { registerCoiServiceWorker } from "@/common/utils/coi.ts";
import { openDefaultErrorToast } from "@/external/react-toastify/toasts.ts";

export const ChessEngineAnalysis = () => {
  const { engineSettings } = useRepertoireSettings();
  const { multiPv } = engineSettings;
  const { analysisState, toggleAnalysis, analysisResults, changeMultiPv } =
    useStockfish(engineSettings);
  const firstResult = head(analysisResults);

  const handleMultiPvChange = async (multiPv: number) => {
    if (multiPv < 1 || multiPv > 10) return;
    repertoireSettingsStore.upsertEngineSettings({ multiPv });

    try {
      await changeMultiPv(multiPv);
    } catch (error) {
      openDefaultErrorToast(error);
    }
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
                    <div>
                      Stockfish requires <pre>cross-origin isolation</pre> to be
                      enabled.
                    </div>
                    <p className="mt-2 font-light">
                      A page refresh is required to enable it.
                    </p>
                    <p className="font-light">Do you want to continue?</p>
                    <p className="mt-4 text-success text-sm">
                      The current PGN and FEN will be saved
                    </p>
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
