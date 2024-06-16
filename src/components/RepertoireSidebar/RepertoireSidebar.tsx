import { CloudEngineEvaluation } from "@/components/RepertoireSidebar/components/CloudEngineEvaluation.tsx";
import { OpeningExplorer } from "@/components/RepertoireSidebar/components/OpeningExplorer/OpeningExplorer.tsx";
import { NavigationMenu } from "@/components/RepertoireSidebar/components/NavigationMenu/NavigationMenu.tsx";
import { PgnExplorer } from "@/components/RepertoireSidebar/components/PgnExplorer.tsx";
import "./RepertoireSidebar.scss";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectSidebar } from "@/stores/zustand/selectors.ts";
import { SIDEBARS } from "@/defs.ts";
import { SettingsMenu } from "@/components/RepertoireSidebar/components/SettingsMenu/SettingsMenu.tsx";
import classNames from "classnames";

export const RepertoireSidebar = () => {
  const sidebar = useRepertoireStore(selectSidebar);

  if (sidebar === SIDEBARS.OPENING_EXPLORER) {
    return (
      <aside className="repertoire-sidebar border-0 md:border border-primary">
        <div className="repertoire-sidebar__engine border-b border-primary">
          <CloudEngineEvaluation />
        </div>
        <div className="repertoire-sidebar__pgn border-0 md:border-b border-primary">
          <PgnExplorer />
        </div>
        <div className="repertoire-sidebar__opening border-0 md:border-b border-primary">
          <OpeningExplorer />
        </div>
        <div className="repertoire-sidebar__navigation">
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
      <div className="md:border-b border-primary">
        <SettingsMenu />
      </div>
      <div className="repertoire-sidebar__navigation">
        <NavigationMenu />
      </div>
    </aside>
  );
};
