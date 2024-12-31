import { CloudEngineEvaluationTable } from "@/features/cloud-engine/CloudEngineEvaluationTable.tsx";
import { OpeningExplorer } from "@/features/opening-explorer/OpeningExplorer.tsx";
import { NavigationMenu } from "@/features/navigation/NavigationMenu.tsx";
import "./RepertoireSidebar.scss";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import { SettingsMenu } from "@/features/sidebar/settings/SettingsMenu.tsx";
import classNames from "classnames";
import { ChessEngineAnalysis } from "@/features/chess-engine/components/ChessEngineAnalysis.tsx";
import { PgnExplorer } from "@/features/pgn/explorer/PgnExplorer.tsx";
import { SIDEBAR_IDS } from "@/features/sidebar/defs.ts";
import {
  selectSidebarId,
  selectSidebarIsOpen,
  selectToggleSidebar,
} from "@/features/sidebar/sidebarSlice.ts";
import type { HTMLAttributes } from "react";
import { isMobileSize } from "@/common/utils/utils.ts";
import { IconButton } from "@/common/components/IconButton.tsx";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";
import { FaArrowRightToBracket } from "react-icons/fa6";

export const RepertoireSidebar = () => {
  const sidebarId = useRepertoireStore(selectSidebarId);
  const sidebarIsOpen = useRepertoireStore(selectSidebarIsOpen);
  const toggleSidebar = useRepertoireStore(selectToggleSidebar);

  if (!sidebarIsOpen && !isMobileSize()) {
    return (
      <RepertoireSidebarContainer className="repertoire-sidebar--collapsed">
        <nav className="p-2 flex flex-col justify-end text-2xl">
          <IconButton onClick={toggleSidebar}>
            <Tooltip tooltip="Expand">
              <FaArrowRightToBracket style={{ transform: "rotate(180deg)" }} />
            </Tooltip>
          </IconButton>
        </nav>
      </RepertoireSidebarContainer>
    );
  }

  if (sidebarId === SIDEBAR_IDS.OPENING_EXPLORER) {
    return (
      <RepertoireSidebarContainer>
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
      </RepertoireSidebarContainer>
    );
  }

  return (
    <RepertoireSidebarContainer className="repertoire-sidebar--settings">
      <div className="overflow-auto">
        <SettingsMenu />
      </div>
      <div className="repertoire-sidebar__navigation border-0 md:border-t border-primary">
        <NavigationMenu />
      </div>
    </RepertoireSidebarContainer>
  );
};

const RepertoireSidebarContainer = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <aside
    className={classNames(
      "repertoire-sidebar",
      "border-0",
      "md:border",
      "border-primary",
      className,
    )}
    {...props}
  >
    {children}
  </aside>
);
