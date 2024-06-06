import { selectPgn } from "@/store/selectors.ts";
import { useChessRepertoireStore } from "@/store/store.ts";
import { toPgn } from "@/external/chessops/pgn/pgn.ts";

export const PgnExplorer = () => {
  const pgn = useChessRepertoireStore(selectPgn);

  return (
    <table className="table table-sm">
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
