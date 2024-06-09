import { useState } from "react";
import { PgnFileInput } from "@/components/Chessboard/PgnImport/components/PgnFileInput.tsx";
import { PgnImportSettings } from "@/components/Chessboard/PgnImport/components/PgnImportSettings.tsx";
import classNames from "classnames";

export const PgnImport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [, setPlayerName] = useState<string | null>(null);
  const [includeComments, setIncludeComments] = useState<boolean>(true);

  return (
    <div className="hidden md:block">
      <button onClick={() => setModalOpen(true)}>Import PGN</button>
      <dialog
        id="my_modal_3"
        className={classNames("modal", {
          "modal-open": modalOpen,
        })}
      >
        <div className="modal-box overflow-visible">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setModalOpen(false)}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-5">Import PGN</h3>
          <div role="alert" className="alert shadow-lg mb-5">
            <div>
              <div className="text-xs">
                New moves from the PGN will be added to your repertoire.
              </div>
            </div>
          </div>
          <hr className="border-base-200" />
          <PgnFileInput
            onFileUpload={(file, playerNames) => {
              setFile(file);
              setPlayerNames(playerNames);
            }}
          />
          {file && (
            <PgnImportSettings
              playerNames={playerNames}
              onSelectPlayerName={setPlayerName}
              includeComments={includeComments}
              onToggleIncludeComments={setIncludeComments}
            />
          )}
          <div className="modal-action">
            <form method="dialog">
              <button disabled={!file} className="btn">
                Upload
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
