import { CloudEngineEvaluation } from "@/components/RepertoireSidebar/components/CloudEngineEvaluation.tsx";
import { OpeningExplorer } from "@/components/RepertoireSidebar/components/OpeningExplorer/OpeningExplorer.tsx";
import { NavigationMenu } from "@/components/RepertoireSidebar/components/NavigationMenu.tsx";
import { PgnExplorer } from "@/components/RepertoireSidebar/components/PgnExplorer.tsx";
import "./RepertoireSidebar.scss";

export const RepertoireSidebar = () => {
  return (
    <aside className="repertoire-sidebar border border-primary">
      <div className="repertoire-sidebar__row border-b border-primary">
        <CloudEngineEvaluation />
      </div>
      <div className="repertoire-sidebar__row border-b border-primary">
        <PgnExplorer />
      </div>
      <div className="repertoire-sidebar__row border-b border-primary">
        <OpeningExplorer />
      </div>
      <div className="repertoire-sidebar__row">
        <NavigationMenu />
      </div>
    </aside>
  );
};
