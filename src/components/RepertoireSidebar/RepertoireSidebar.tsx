import { CloudEngineEvaluation } from "@/components/RepertoireSidebar/components/CloudEngineEvaluation.tsx";
import { OpeningExplorer } from "@/components/RepertoireSidebar/components/OpeningExplorer/OpeningExplorer.tsx";
import { NavigationMenu } from "@/components/RepertoireSidebar/components/NavigationMenu.tsx";
import { PgnExplorer } from "@/components/RepertoireSidebar/components/PgnExplorer.tsx";

export const RepertoireSidebar = () => {
  return (
    <aside className="pl-2.5">
      <div className="w-full" style={{ height: "95vh" }}>
        <div className="h-1/6 overflow-x-auto mb-3">
          <CloudEngineEvaluation />
        </div>
        <div className="h-1/6 overflow-x-auto mb-3">
          <PgnExplorer />
        </div>
        <div className="h-2/6 overflow-y-auto">
          <OpeningExplorer />
        </div>
        <div>
          <NavigationMenu />
        </div>
      </div>
    </aside>
  );
};
