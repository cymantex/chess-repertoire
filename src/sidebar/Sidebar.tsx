import { CloudEngineEvaluation } from "@/sidebar/CloudEngineEvaluation.tsx";
import { OpeningExplorer } from "@/sidebar/OpeningExplorer.tsx";
import { NavigationMenu } from "@/sidebar/NavigationMenu.tsx";

export const Sidebar = () => {
  return (
    <aside className="pl-2.5">
      <div className="w-full" style={{ height: "95vh" }}>
        <div className="h-1/6 overflow-x-auto mb-3">
          <CloudEngineEvaluation />
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
