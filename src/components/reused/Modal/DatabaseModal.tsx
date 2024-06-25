import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectCreateDatabase,
  selectDatabases,
  selectListDatabases,
  selectSelectDatabase,
  selectSelectedDatabase,
} from "@/stores/zustand/selectors.ts";
import { Modal } from "@/components/reused/Modal/Modal.tsx";
import { MODAL_IDS, modalStore } from "@/stores/modalStore.tsx";
import classNames from "classnames";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  DEFAULT_DB_DISPLAY_NAME,
  toDbName,
} from "@/external/idb-keyval/utils.ts";
import { idbDeleteDatabase } from "@/external/idb-keyval/adapter.ts";

export const DatabaseModal = () => {
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);
  const databases = useRepertoireStore(selectDatabases);
  const createDatabase = useRepertoireStore(selectCreateDatabase);
  const listDatabases = useRepertoireStore(selectListDatabases);
  const selectDatabase = useRepertoireStore(selectSelectDatabase);

  const [newDatabaseName, setNewDatabaseName] = useState<string>("");

  const handleDeleteDatabase = async (dbDisplayName: string) => {
    modalStore.showLoadingModal("Deleting database...");

    try {
      await idbDeleteDatabase(toDbName(dbDisplayName));
      await listDatabases();
    } catch (error) {
      console.error(error);
      // @ts-ignore
      toast.error(error.message);
    } finally {
      modalStore.closeModal(MODAL_IDS.LOADING);
    }
  };

  const handleCreateDatabase = async () => {
    try {
      await createDatabase(newDatabaseName!);
    } catch (error) {
      // @ts-ignore
      toast.error(error.message);
    }

    setNewDatabaseName("");
  };

  // TODO: Refactor
  return (
    <Modal show>
      <Modal.CloseButton onClick={() => modalStore.closeAllModals()} />
      <Modal.Title>Manage repertoire databases</Modal.Title>
      <div role="alert" className="alert bg-base-200 mb-2 block">
        <div className="text-xs">
          Here you can divide your repertoire into different databases.
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th />
            <th>Database name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {databases.map((dbName) => (
            <tr
              className={classNames({
                "bg-base-200": dbName === selectedDatabase,
              })}
              key={dbName}
            >
              <td>
                <input
                  type="radio"
                  name="radio-1"
                  className="radio radio-xs"
                  checked={
                    !selectedDatabase
                      ? dbName === DEFAULT_DB_DISPLAY_NAME
                      : dbName === selectedDatabase
                  }
                  onChange={() => selectDatabase(dbName)}
                />
              </td>
              <td>{dbName}</td>
              <td>
                <IconButton
                  title={
                    dbName === DEFAULT_DB_DISPLAY_NAME
                      ? "Default repertoire cannot be deleted"
                      : `Delete ${dbName} database`
                  }
                  className={classNames({
                    "transition-all hover:scale-125":
                      dbName !== DEFAULT_DB_DISPLAY_NAME,
                  })}
                  disabled={dbName === DEFAULT_DB_DISPLAY_NAME}
                  onClick={() =>
                    modalStore.showConfirmModal({
                      children: `Are you sure you want to delete '${dbName}'?`,
                      onConfirm: () => handleDeleteDatabase(dbName),
                    })
                  }
                >
                  <FaTrash />
                </IconButton>
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ width: "1%", whiteSpace: "nowrap" }} />
            <td className="relative">
              <input
                className="bg-base-100 absolute pl-4 top-0 bottom-0 right-0 left-0 focus:outline-none"
                placeholder="New database name"
                autoFocus
                value={newDatabaseName}
                onChange={(e) => setNewDatabaseName(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    return handleCreateDatabase();
                  }
                }}
                type="text"
              />
            </td>
            <td>
              <IconButton
                title="Create new database"
                className="transition-all hover:scale-125"
                disabled={
                  !newDatabaseName || databases.includes(newDatabaseName)
                }
                onClick={handleCreateDatabase}
              >
                <FaPlus />
              </IconButton>
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};
