import { useRepertoireStore } from "@/app/zustand/store.ts";
import type { ModalId } from "@/common/components/Modal/Modal.tsx";
import { Modal } from "@/common/components/Modal/Modal.tsx";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { toDbName } from "@/external/idb-keyval/utils.ts";
import { idbDeleteDatabase } from "@/external/idb-keyval/adapter.ts";
import { CreateDatabaseTr } from "@/features/repertoire/database/CreateDatabaseTr.tsx";
import { DatabaseTr } from "@/features/repertoire/database/DatabaseTr.tsx";
import { openDefaultErrorToast } from "@/external/react-toastify/toasts.ts";
import {
  selectCreateDatabase,
  selectDatabases,
  selectGetCurrentRepertoirePosition,
  selectListDatabases,
  selectSelectDatabase,
  selectSelectedDatabase,
} from "@/features/repertoire/repertoireSlice.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

export const DatabaseModal = ({ id }: ModalId) => {
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);
  const databases = useRepertoireStore(selectDatabases);
  const createDatabase = useRepertoireStore(selectCreateDatabase);
  const listDatabases = useRepertoireStore(selectListDatabases);
  const selectDatabase = useRepertoireStore(selectSelectDatabase);
  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  const handleDeleteDatabase = async (dbDisplayName: string) => {
    modalStore.addLoadingModal("Deleting database...");

    try {
      await idbDeleteDatabase(toDbName(dbDisplayName));
      await listDatabases();
      await getCurrentRepertoirePosition();
    } catch (error) {
      openDefaultErrorToast(error);
    } finally {
      modalStore.closeModal(MODAL_IDS.LOADING);
    }
  };

  const handleCreateDatabase = async (newDatabaseName: string) => {
    try {
      await createDatabase(newDatabaseName);
    } catch (error) {
      openDefaultErrorToast(error);
    }
  };

  return (
    <Modal id={id} show>
      <Modal.CloseButton onClick={() => modalStore.closeModal(id)} />
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
            <DatabaseTr
              key={dbName}
              dbName={dbName}
              selectedDatabase={selectedDatabase}
              onSelect={() => selectDatabase(dbName)}
              onDelete={() =>
                modalStore.addConfirmModal({
                  children: `Are you sure you want to delete '${dbName}'?`,
                  onConfirm: () => handleDeleteDatabase(dbName),
                })
              }
            />
          ))}
          <CreateDatabaseTr
            onCreate={handleCreateDatabase}
            databaseNames={databases}
          />
        </tbody>
      </table>
    </Modal>
  );
};
