import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";
import { AccordingTable } from "@/components/reused/AccordionTable/AccordingTable.tsx";
import { SiLichess } from "react-icons/si";
import {
  repertoireSettingsStore,
  useRepertoireSettings,
} from "@/stores/repertoireSettingsStore.ts";
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
import { ThMenu } from "@/components/reused/ThMenu/ThMenu.tsx";
import { OpeningExplorerQueryTbody } from "@/components/RepertoireSidebar/OpeningExplorer/OpeningExplorerQueryTbody.tsx";
import { OpeningExplorerTbody } from "@/components/RepertoireSidebar/OpeningExplorer/OpeningExplorerTbody.tsx";

export const OpeningExplorerTable = () => {
  const queryClient = useQueryClient();
  const fen = useRepertoireStore(selectFen);
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);
  const { openingExplorerApi } = useRepertoireSettings();

  const determineNextOpeningExplorerApi = () => {
    if (openingExplorerApi === OPENING_EXPLORER_API.MASTERS) {
      return OPENING_EXPLORER_API.LICHESS;
    } else if (openingExplorerApi === OPENING_EXPLORER_API.LICHESS) {
      return OPENING_EXPLORER_API.NONE;
    }
    return OPENING_EXPLORER_API.MASTERS;
  };

  const handleToggleOpeningExplorerApi = async () => {
    await queryClient.invalidateQueries({
      queryKey: [`opening-explorer-${fen}`],
    });

    repertoireSettingsStore.upsertSettings({
      openingExplorerApi: determineNextOpeningExplorerApi(),
    });
  };

  return (
    <AccordingTable
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
                    onClick={() =>
                      modalStore.setModal(
                        <DatabaseModal id={MODAL_IDS.DATABASE} />,
                      )
                    }
                  >
                    <FaDatabase />
                  </ThMenu.IconButton>
                  <span title={selectedDatabase} className="max-w-20 truncate">
                    {selectedDatabase}
                  </span>
                </ThMenu.Item>
                <ThMenu.Item>
                  <ThMenu.IconButton onClick={handleToggleOpeningExplorerApi}>
                    <OpeningExplorerApiIcon />
                  </ThMenu.IconButton>
                </ThMenu.Item>
                {!collapsed && (
                  <ThMenu.Item>
                    <TopGamesButton />
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

export const OpeningExplorerApiIcon = () => {
  const { openingExplorerApi } = useRepertoireSettings();

  if (openingExplorerApi === OPENING_EXPLORER_API.MASTERS) {
    return <FaBook title="Masters database" />;
  } else if (openingExplorerApi === OPENING_EXPLORER_API.LICHESS) {
    return <SiLichess title="Lichess database" />;
  }

  return <FaDatabase title="Repertoire database" />;
};
