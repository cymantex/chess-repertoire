import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { Loader } from "@/components/reused/Loader.tsx";
import { ApiError } from "@/components/reused/ApiError.tsx";
import { useOpeningExplorerQuery } from "@/components/RepertoireSidebar/OpeningExplorer/useOpeningExplorerQuery.tsx";
import { OpeningExplorerTbody } from "@/components/RepertoireSidebar/OpeningExplorer/OpeningExplorerTbody.tsx";

export const OpeningExplorerQueryTbody = () => {
  const fen = useRepertoireStore(selectFen);
  const { isPending, error, data } = useOpeningExplorerQuery(fen);

  if (isPending) {
    return (
      <tr>
        <td>
          <Loader />
        </td>
      </tr>
    );
  }
  if (error)
    return (
      <tr>
        <td>
          <ApiError error={error} />
        </td>
      </tr>
    );

  return <OpeningExplorerTbody openingExplorerMoves={data.moves} />;
};
