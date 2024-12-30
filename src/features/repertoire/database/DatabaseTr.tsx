import { DEFAULT_DB_DISPLAY_NAME } from "@/external/idb-keyval/utils.ts";
import classNames from "classnames";
import { IconButton } from "@/common/components/IconButton.tsx";
import { FaTrash } from "react-icons/fa";

export const DatabaseTr = ({
  dbName,
  onSelect,
  onDelete,
  selectedDatabase,
}: {
  dbName: string;
  selectedDatabase: string | undefined;
  onSelect: () => Promise<void>;
  onDelete: () => void;
}) => {
  const dbIsDefault = dbName === DEFAULT_DB_DISPLAY_NAME;

  return (
    <tr
      className={classNames({
        "bg-base-200": dbName === selectedDatabase,
      })}
    >
      <td>
        <input
          type="radio"
          name="radio-1"
          className="radio radio-xs"
          checked={
            !selectedDatabase ? dbIsDefault : dbName === selectedDatabase
          }
          onChange={onSelect}
        />
      </td>
      <td>{dbName}</td>
      <td>
        <IconButton
          title={
            dbIsDefault
              ? "Default repertoire cannot be deleted"
              : `Delete ${dbName} database`
          }
          className={classNames({
            "transition-all hover:scale-125": !dbIsDefault,
          })}
          disabled={dbIsDefault}
          onClick={onDelete}
        >
          <FaTrash />
        </IconButton>
      </td>
    </tr>
  );
};
