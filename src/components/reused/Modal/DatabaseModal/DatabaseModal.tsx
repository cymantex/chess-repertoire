import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectCreateDatabase,
  selectDatabases,
  selectGetCurrentRepertoirePosition,
  selectListDatabases,
  selectSelectDatabase,
  selectSelectedDatabase,
} from "@/stores/zustand/selectors.ts";
import { Modal, ModalId } from "@/components/reused/Modal/Modal.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { toDbName } from "@/external/idb-keyval/utils.ts";
import { idbDeleteDatabase } from "@/external/idb-keyval/adapter.ts";
import { CreateDatabaseTr } from "@/components/reused/Modal/DatabaseModal/CreateDatabaseTr.tsx";
import { DatabaseTr } from "@/components/reused/Modal/DatabaseModal/DatabaseTr.tsx";
import { MODAL_IDS } from "@/defs.ts";
import { openErrorToast } from "@/external/react-toastify/toasts.ts";

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
      console.error(error);
      // @ts-ignore
      openErrorToast(error.message);
    } finally {
      modalStore.closeModal(MODAL_IDS.LOADING);
    }
  };

  const handleCreateDatabase = async (newDatabaseName: string) => {
    try {
      await createDatabase(newDatabaseName);
    } catch (error) {
      console.error(error);
      // TODO: Handle errors more gracefully
      // @ts-ignore
      openErrorToast(error.message);
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
