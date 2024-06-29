import { OpeningExplorerTbody } from "@/components/RepertoireSidebar/OpeningExplorer/OpeningExplorerTbody.tsx";
import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";
import { SiLichess } from "react-icons/si";
import { IconButton } from "@/components/reused/IconButton.tsx";
import {
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
import { FaBook, FaDatabase } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectFen,
  selectSelectedDatabase,
} from "@/stores/zustand/selectors.ts";
import { modalStore } from "@/stores/modalStore.tsx";
import { DatabaseModal } from "@/components/reused/Modal/DatabaseModal/DatabaseModal.tsx";
import { MODAL_IDS, OPENING_EXPLORER_API } from "@/defs.ts";
import { TopGamesButton } from "@/components/RepertoireSidebar/OpeningExplorer/TopGamesButton.tsx";
import classNames from "classnames";

export const OpeningExplorerTable = () => {
  const queryClient = useQueryClient();
  const fen = useRepertoireStore(selectFen);
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);
  const { openingExplorerApi } = useRepertoireSettings();

  const handleToggleOpeningExplorerApi = async () => {
    await queryClient.invalidateQueries({
      queryKey: [`opening-explorer-${fen}`],
    });

    localStorageStore.upsertSettings({
      openingExplorerApi:
        openingExplorerApi === OPENING_EXPLORER_API.MASTERS
          ? OPENING_EXPLORER_API.LICHESS
          : OPENING_EXPLORER_API.MASTERS,
    });
  };

  return (
    <AccordingTable
      section={TOGGLE_SECTIONS.OPENING_EXPLORER}
      renderTheadTrChildren={(toggleButton, collapsed) => (
        <>
          <td>Move</td>
          <td>Games</td>
          <td>
            <div className="flex justify-between pr-6">
              <div>Annotation</div>
              <div className="flex">
                <div className="flex gap-2 pr-2 border-r border-primary">
                  <IconButton
                    className="text-base-content transition-all hover:scale-125"
                    onClick={() =>
                      modalStore.setModal(
                        <DatabaseModal id={MODAL_IDS.DATABASE} />,
                      )
                    }
                  >
                    <FaDatabase />
                  </IconButton>
                  <span title={selectedDatabase} className="max-w-20 truncate">
                    {selectedDatabase}
                  </span>
                </div>
                <IconButton
                  className={classNames(
                    "text-base-content pl-2 transition-transform hover:scale-125",
                    {
                      "pr-2 border-r border-primary": !collapsed,
                    },
                  )}
                  onClick={handleToggleOpeningExplorerApi}
                >
                  {openingExplorerApi === OPENING_EXPLORER_API.MASTERS ? (
                    <SiLichess title="Lichess games" />
                  ) : (
                    <FaBook title="Master games" />
                  )}
                </IconButton>
                {!collapsed && <TopGamesButton />}
              </div>
            </div>
            {toggleButton}
          </td>
        </>
      )}
      className="table-sm table-zebra select-none"
      renderChildren={(collapsed) =>
        !collapsed ? <OpeningExplorerTbody key={openingExplorerApi} /> : null
      }
    />
  );
};
