import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/reused/Loader.tsx";
import { FetchError } from "@/components/reused/FetchError.tsx";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { OpeningExplorerResponse } from "@/defs.ts";
import { RepertoireOpeningMovesTbody } from "@/components/RepertoireSidebar/components/OpeningExplorer/RepertoireOpeningMovesTbody.tsx";

export const OpeningExplorer = () => {
  const fen = useRepertoireStore(selectFen);
  const { isPending, error, data } = useQuery<OpeningExplorerResponse>({
    queryKey: [`opening-explorer-${fen}`],
    queryFn: () =>
      fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

  if (isPending) return <Loader />;
  if (error) return <FetchError error={error} />;

  return (
    <table className="table table-sm table-zebra select-none">
      <thead>
        <tr>
          <td>Move</td>
          <td>Games</td>
          <td>Annotation</td>
        </tr>
      </thead>
      <RepertoireOpeningMovesTbody openingExplorerMoves={data.moves} />
    </table>
  );
};
