import {
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
import { useStockfish } from "@/stockfish/useStockfish.ts";
import { head } from "lodash";
import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";
import { ChessEngineAnalysisThead } from "@/components/RepertoireSidebar/ChessEngineAnalysis/ChessEngineAnalysisThead.tsx";
import { ChessEngineAnalysisTbody } from "@/components/RepertoireSidebar/ChessEngineAnalysis/ChessEngineAnalysisTbody.tsx";

export const ChessEngineAnalysis = () => {
  const { engineSettings } = useRepertoireSettings();
  const { multiPv } = engineSettings;
  const { analysisState, toggleAnalysis, analysisResults, changeMultiPv } =
    useStockfish(engineSettings);
  const firstResult = head(analysisResults);

  const handleMultiPvChange = (multiPv: number) => {
    if (multiPv < 1 || multiPv > 10) return;
    localStorageStore.upsertEngineSettings({ multiPv });
    return changeMultiPv(multiPv);
  };

  return (
    <AccordingTable
      className="table-xs"
      section={TOGGLE_SECTIONS.CHESS_ENGINE_ANALYSIS}
      renderTheadTrChildren={(toggleButton) => (
        <ChessEngineAnalysisThead
          analysisState={analysisState}
          onChange={toggleAnalysis}
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
