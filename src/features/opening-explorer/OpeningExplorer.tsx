import { TOGGLE_SECTIONS } from "@/features/repertoire/defs.ts";
import { AccordionTable } from "@/common/components/AccordionTable/AccordionTable.tsx";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { FaChessBoard, FaDatabase } from "react-icons/fa";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { DatabaseModal } from "@/features/repertoire/database/components/DatabaseModal.tsx";
import { TopGamesButton } from "@/features/opening-explorer/top-games/TopGamesButton.tsx";
import { ThMenu } from "@/common/components/ThMenu/ThMenu.tsx";
import { OpeningExplorerQueryTbody } from "@/features/opening-explorer/components/OpeningExplorerQueryTbody.tsx";
import { OpeningExplorerTbody } from "@/features/opening-explorer/components/OpeningExplorerTbody.tsx";
import { IconButton } from "@/common/components/IconButton.tsx";
import { OpeningExplorerApiSelect } from "@/features/opening-explorer/components/OpeningExplorerApiSelect.tsx";
import { selectSelectedDatabase } from "@/features/repertoire/repertoireSlice.ts";
import { OPENING_EXPLORER_API } from "@/features/opening-explorer/defs.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

export const OpeningExplorer = () => {
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);
  const { openingExplorerApi } = useRepertoireSettings();

  return (
    <AccordionTable
      className="table-sm table-zebra select-none"
      section={TOGGLE_SECTIONS.OPENING_EXPLORER}
      renderTheadTrChildren={(toggleButton, collapsed) => (
        <>
          <td>Move</td>
          <td>Games</td>
          <td>
            <ThMenu.Container>
              <div>Annotation</div>
              <ThMenu>
                <ThMenu.Item>
                  <ThMenu.IconButton
                    title="Manage repertoire databases"
                    onClick={() =>
                      modalStore.setModal(
                        <DatabaseModal id={MODAL_IDS.DATABASE} />,
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <FaDatabase />
                      <span
                        title={selectedDatabase}
                        className="text-base-content/50 max-w-20 truncate"
                      >
                        {selectedDatabase}
                      </span>
                    </div>
                  </ThMenu.IconButton>
                </ThMenu.Item>
                <ThMenu.Item>
                  <OpeningExplorerApiSelect />
                </ThMenu.Item>
                {!collapsed && (
                  <ThMenu.Item>
                    {openingExplorerApi !== OPENING_EXPLORER_API.NONE ? (
                      <TopGamesButton />
                    ) : (
                      <IconButton
                        disabled
                        className="text-base-300 cursor-not-allowed"
                      >
                        <FaChessBoard />
                      </IconButton>
                    )}
                  </ThMenu.Item>
                )}
              </ThMenu>
            </ThMenu.Container>
            {toggleButton}
          </td>
        </>
      )}
      renderChildren={(collapsed) => {
        if (collapsed) return null;
        if (openingExplorerApi === OPENING_EXPLORER_API.NONE)
          return <OpeningExplorerTbody />;
        return <OpeningExplorerQueryTbody key={openingExplorerApi} />;
      }}
    />
  );
};
