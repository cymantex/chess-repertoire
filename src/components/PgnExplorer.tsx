import { selectPgn } from "@/stores/zustand/selectors.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { toPgn } from "@/external/chessops/pgn.ts";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";

export const PgnExplorer = () => {
  const pgn = useRepertoireStore(selectPgn);

  return (
    <HideOnMobile>
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
    </HideOnMobile>
  );
};
