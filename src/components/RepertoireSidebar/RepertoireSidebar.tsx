import { CloudEngineEvaluationTable } from "@/components/RepertoireSidebar/components/CloudEngineEvaluation/CloudEngineEvaluationTable.tsx";
import { OpeningExplorerTable } from "@/components/RepertoireSidebar/components/OpeningExplorer/OpeningExplorerTable.tsx";
import { NavigationMenu } from "@/components/RepertoireSidebar/components/NavigationMenu/NavigationMenu.tsx";
import "./RepertoireSidebar.scss";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectSidebar } from "@/stores/zustand/selectors.ts";
import { SIDEBARS } from "@/defs.ts";
import { SettingsMenu } from "@/components/RepertoireSidebar/components/SettingsMenu/SettingsMenu.tsx";
import classNames from "classnames";
import { ChessEngineAnalysis } from "@/components/RepertoireSidebar/components/ChessEngineAnalysis.tsx";
import { PgnExplorer } from "@/components/PgnExplorer.tsx";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";

export const RepertoireSidebar = () => {
  const sidebar = useRepertoireStore(selectSidebar);

  if (sidebar === SIDEBARS.OPENING_EXPLORER) {
    return (
      <aside className="repertoire-sidebar border-0 md:border border-primary">
        <HideOnMobile className="overflow-auto">
          <div className="border-0 border-b border-primary">
            <ChessEngineAnalysis />
          </div>
        </HideOnMobile>
        <HideOnMobile className="overflow-auto">
          <div className="border-b border-primary">
            <CloudEngineEvaluationTable />
          </div>
        </HideOnMobile>
        <HideOnMobile className="overflow-auto">
          <div className="border-b border-primary">
            <PgnExplorer />
          </div>
        </HideOnMobile>
        <div className="overflow-auto border-t border-primary repertoire-sidebar__opening">
          <OpeningExplorerTable />
        </div>
        <div className="repertoire-sidebar__navigation p-2 border-0 md:border-t border-primary">
          <NavigationMenu />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={classNames(
        "repertoire-sidebar",
        "repertoire-sidebar--settings",
        "border-0",
        "md:border",
        "border-primary",
      )}
    >
      <div className="overflow-auto">
        <SettingsMenu />
      </div>
      <div className="repertoire-sidebar__navigation p-2 border-0 md:border-t border-primary">
        <NavigationMenu />
      </div>
    </aside>
  );
};
