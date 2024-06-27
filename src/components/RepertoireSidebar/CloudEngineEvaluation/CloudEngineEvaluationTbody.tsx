import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { useQuery } from "@tanstack/react-query";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { Loader } from "@/components/reused/Loader.tsx";
import { FetchError } from "@/components/reused/FetchError.tsx";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { CloudEvaluationResponse } from "@/defs.ts";
import { Eval } from "@/components/reused/Eval.tsx";
import { TdWithOverflowCaret } from "@/components/reused/TdWithOverflowCaret.tsx";
import { NextMoves } from "@/components/reused/NextMoves.tsx";
import { usePreviousMoves } from "@/hooks/usePreviousMoves.ts";

export const CloudEngineEvaluationTbody = () => {
  const fen = useRepertoireStore(selectFen);
  const { isPending, error, data } = useQuery<CloudEvaluationResponse>({
    queryKey: [`cloud-evaluation-${fen}`],
    queryFn: () =>
      fetch(`https://lichess.org/api/cloud-eval?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });
  const previousMoves = usePreviousMoves();

  if (isPending)
    return (
      <tr>
        <td>
          <Loader />
        </td>
      </tr>
    );
  // TODO: Display something on 404
  if (error)
    return (
      <tr>
        <td>
          <FetchError error={error} />
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
