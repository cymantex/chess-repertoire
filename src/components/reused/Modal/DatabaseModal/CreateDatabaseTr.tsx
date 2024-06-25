import { useState } from "react";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { FaPlus } from "react-icons/fa";

export const CreateDatabaseTr = ({
  onCreate,
  databaseNames,
}: {
  onCreate: (newDatabaseName: string) => void;
  databaseNames: string[];
}) => {
  const [newDatabaseName, setNewDatabaseName] = useState<string>("");

  const handleCreateDatabase = async () => {
    onCreate(newDatabaseName);
    setNewDatabaseName("");
  };

  return (
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
          disabled={!newDatabaseName || databaseNames.includes(newDatabaseName)}
          onClick={handleCreateDatabase}
        >
          <FaPlus />
        </IconButton>
      </td>
    </tr>
  );
};
