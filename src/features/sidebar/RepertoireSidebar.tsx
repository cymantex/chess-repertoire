import { CloudEngineEvaluationTable } from "@/features/cloud-engine/CloudEngineEvaluationTable.tsx";
import { OpeningExplorer } from "@/features/opening-explorer/OpeningExplorer.tsx";
import { NavigationMenu } from "@/features/navigation/NavigationMenu.tsx";
import "./RepertoireSidebar.scss";
import { selectSidebar, useRepertoireStore } from "@/app/zustand/store.ts";
import { SettingsMenu } from "@/features/sidebar/settings/SettingsMenu.tsx";
import classNames from "classnames";
import { ChessEngineAnalysis } from "@/features/chess-engine/components/ChessEngineAnalysis.tsx";
import { PgnExplorer } from "@/features/pgn/explorer/PgnExplorer.tsx";
import { SIDEBARS } from "@/features/sidebar/defs.ts";

export const RepertoireSidebar = () => {
  const sidebar = useRepertoireStore(selectSidebar);

  if (sidebar === SIDEBARS.OPENING_EXPLORER) {
    return (
      <aside className="repertoire-sidebar border-0 md:border border-primary">
        <div className="overflow-auto border-0 border-b border-primary">
          <ChessEngineAnalysis />
        </div>
        <div className="overflow-auto border-b border-primary">
          <CloudEngineEvaluationTable />
        </div>
        <div className="overflow-auto border-b border-primary">
          <PgnExplorer />
        </div>
        <div className="overflow-auto border-t border-primary repertoire-sidebar__opening">
          <OpeningExplorer />
        </div>
        <div className="repertoire-sidebar__navigation border-0 md:border-t border-primary">
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
      <div className="repertoire-sidebar__navigation border-0 md:border-t border-primary">
        <NavigationMenu />
      </div>
    </aside>
  );
};
