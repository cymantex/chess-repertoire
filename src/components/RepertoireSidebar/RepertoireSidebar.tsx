import { CloudEngineEvaluation } from "@/components/RepertoireSidebar/components/CloudEngineEvaluation.tsx";
import { OpeningExplorer } from "@/components/RepertoireSidebar/components/OpeningExplorer/OpeningExplorer.tsx";
import { NavigationMenu } from "@/components/RepertoireSidebar/components/NavigationMenu/NavigationMenu.tsx";
import { PgnExplorer } from "@/components/RepertoireSidebar/components/PgnExplorer.tsx";
import "./RepertoireSidebar.scss";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectGetCurrentRepertoirePosition,
  selectSidebar,
} from "@/stores/zustand/selectors.ts";
import { SIDEBARS } from "@/defs.ts";
import { exportPgnAsync } from "@/pgn/export/exportPgnAsync.ts";
import {
  exportRepertoireFile,
  startImportRepertoireWorker,
} from "@/repertoire/repertoireIo.ts";
import { PgnImport } from "@/components/Chessboard/PgnImport/PgnImport.tsx";
import { LoadingModal } from "@/components/reused/LoadingModal.tsx";
import React, { ChangeEvent, ReactNode, useState } from "react";
import { toast } from "react-toastify";

export const RepertoireSidebar = () => {
  const sidebar = useRepertoireStore(selectSidebar);
  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingModalContent, setLoadingModalContent] =
    useState<ReactNode>(null);

  const fileInput = React.createRef<HTMLInputElement>();

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

  // TODO: Extract component
  const handleRepertoireExport = async () => {
    setShowLoadingModal(true);
    setLoadingModalContent(
      <>
        Exporting repertoire... <br />
        <span className="text-sm">(this could take many minutes)</span>
      </>,
    );

    window.onbeforeunload = (event) => event.preventDefault();

    try {
      await exportRepertoireFile();
    } catch (error) {
      console.error(error);
      // @ts-ignore
      toast.error(`Failed to export repertoire ${error.message}`);
    } finally {
      window.onbeforeunload = null;
    }

    setShowLoadingModal(false);
  };

  const handleRepertoireImport = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;

    window.onbeforeunload = (event) => event.preventDefault();

    setShowLoadingModal(true);
    setLoadingModalContent(
      <>
        Importing repertoire... <br />
        <span className="text-sm">(this could take many minutes)</span>
      </>,
    );

    try {
      await startImportRepertoireWorker(file);
      toast.success("Repertoire imported.");
    } catch (error) {
      console.error(error);
      // @ts-ignore
      toast.error(`Failed to import repertoire ${error.message}`);
    } finally {
      window.onbeforeunload = null;
    }

    await getCurrentRepertoirePosition();

    setShowLoadingModal(false);
  };

  // TODO: Clear repertoire
  // TODO: Theme switcher!
  return (
    <aside className="repertoire-sidebar repertoire-sidebar__settings border-0 md:border border-primary">
      <div className="repertoire-sidebar__pgn-io border-b border-primary">
        <div role="alert" className="alert bg-base-300 mb-2 text-center block">
          <div>
            <h3 className="font-bold text-base">Settings</h3>
            <div className="text-xs">Import and export your repertoire.</div>
          </div>
        </div>
        <PgnImport />
        <button className="btn w-full  mb-2" onClick={exportPgnAsync}>
          Export PGN
        </button>
        <button
          className="btn w-full mb-2"
          onClick={() => fileInput.current?.click()}
        >
          Import Repertoire
        </button>
        <button className="btn w-full" onClick={handleRepertoireExport}>
          Export Repertoire
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInput}
          onChange={handleRepertoireImport}
        />
      </div>
      <div className="repertoire-sidebar__navigation">
        <NavigationMenu />
      </div>
      <LoadingModal show={showLoadingModal}>{loadingModalContent}</LoadingModal>
    </aside>
  );
};
