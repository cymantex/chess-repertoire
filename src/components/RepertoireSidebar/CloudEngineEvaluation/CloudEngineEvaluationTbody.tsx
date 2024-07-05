import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { Loader } from "@/components/reused/Loader.tsx";
import { ApiError } from "@/components/reused/ApiError.tsx";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { Eval } from "@/components/reused/Eval.tsx";
import { TdWithOverflowCaret } from "@/components/reused/TdWithOverflowCaret.tsx";
import { NextMoves } from "@/components/reused/NextMoves.tsx";
import { usePreviousMoves } from "@/hooks/usePreviousMoves.ts";
import { useCloudEvaluationQuery } from "@/components/RepertoireSidebar/CloudEngineEvaluation/useCloudEvaluationQuery.tsx";

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
