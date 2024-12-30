import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { selectFen, useRepertoireStore } from "@/app/zustand/store.ts";
import { Loader } from "@/common/components/Loader.tsx";
import { ApiError } from "@/common/components/ApiError.tsx";
import { Eval } from "@/common/components/Eval.tsx";
import { TdWithOverflowCaret } from "@/common/components/TdWithOverflowCaret.tsx";
import { NextMoves } from "@/common/components/NextMoves.tsx";
import { usePreviousMoves } from "@/common/hooks/usePreviousMoves.ts";
import { useCloudEvaluationQuery } from "@/features/cloud-engine/useCloudEvaluationQuery.tsx";

export const CloudEngineEvaluationTbody = () => {
  const fen = useRepertoireStore(selectFen);
  const { isPending, error, data } = useCloudEvaluationQuery(fen);
  const previousMoves = usePreviousMoves();

  if (isPending)
    return (
      <tr>
        <td>
          <Loader />
        </td>
      </tr>
    );
  if (error)
    return (
      <tr>
        <td>
          <ApiError
            error={error}
            notFoundErrorMessage="Evaluation not available for this position."
          />
        </td>
      </tr>
    );

  const chessopsPosition = parsePosition(fen);

  return (
    <>
      {data.pvs?.map((pv) => (
        <tr className="font-chess" key={pv.moves}>
          <TdWithOverflowCaret flex>
            <Eval {...pv} />
            <NextMoves
              variationOfNextMoves={uciMovesToSan(
                chessopsPosition,
                pv.moves,
              ).split(" ")}
              previousMoves={previousMoves}
            />
          </TdWithOverflowCaret>
        </tr>
      ))}
    </>
  );
};
