import { CloudEngineEvaluation } from "@/components/RepertoireSidebar/components/CloudEngineEvaluation.tsx";
import { OpeningExplorer } from "@/components/RepertoireSidebar/components/OpeningExplorer/OpeningExplorer.tsx";
import { NavigationMenu } from "@/components/RepertoireSidebar/components/NavigationMenu/NavigationMenu.tsx";
import "./RepertoireSidebar.scss";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectSidebar } from "@/stores/zustand/selectors.ts";
import { SIDEBARS } from "@/defs.ts";
import { SettingsMenu } from "@/components/RepertoireSidebar/components/SettingsMenu/SettingsMenu.tsx";
import classNames from "classnames";
import { ChessEngineAnalysis } from "@/components/RepertoireSidebar/components/ChessEngineAnalysis.tsx";
import { PgnExplorer } from "@/components/PgnExplorer.tsx";

export const RepertoireSidebar = () => {
  const sidebar = useRepertoireStore(selectSidebar);

  if (sidebar === SIDEBARS.OPENING_EXPLORER) {
    return (
      <aside className="repertoire-sidebar border-0 md:border border-primary">
        <div className="overflow-auto border-0 md:border-b border-primary">
          <ChessEngineAnalysis />
        </div>
        <div className="overflow-auto md:border-b border-primary">
          <CloudEngineEvaluation />
        </div>
        <div className="overflow-auto md:border-b border-primary">
          <PgnExplorer />
        </div>
        <div className="overflow-auto repertoire-sidebar__opening">
          <OpeningExplorer />
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
      <div className="">
        <SettingsMenu />
      </div>
      <div className="repertoire-sidebar__navigation p-2 border-0 md:border-t border-primary">
        <NavigationMenu />
      </div>
    </aside>
  );
};
