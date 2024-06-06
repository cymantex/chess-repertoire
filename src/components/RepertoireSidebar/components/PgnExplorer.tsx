import { selectPgn } from "@/store/selectors.ts";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import { toPgn } from "@/external/chessops/pgn/pgn.ts";

export const PgnExplorer = () => {
  const pgn = useRepertoireStore(selectPgn);

  return (
    <table className="table table-xs">
      <thead>
        <tr>
          <td>PGN</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{toPgn(pgn)}</td>
        </tr>
      </tbody>
    </table>
  );
};
