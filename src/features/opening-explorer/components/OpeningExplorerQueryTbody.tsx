import { selectFen, useRepertoireStore } from "@/app/zustand/store.ts";
import { Loader } from "@/common/components/Loader.tsx";
import { ApiError } from "@/common/components/ApiError.tsx";
import { useOpeningExplorerQuery } from "@/features/opening-explorer/useOpeningExplorerQuery.tsx";
import { OpeningExplorerTbody } from "@/features/opening-explorer/components/OpeningExplorerTbody.tsx";

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
