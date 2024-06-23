import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { useQuery } from "@tanstack/react-query";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { Loader } from "@/components/reused/Loader.tsx";
import { FetchError } from "@/components/reused/FetchError.tsx";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { CloudEvaluationResponse } from "@/defs.ts";
import { Eval } from "@/components/reused/Eval.tsx";
import { TdWithOverflowCaret } from "@/components/reused/TdWithOverflowCaret.tsx";

export const CloudEngineEvaluationTbody = () => {
  const fen = useRepertoireStore(selectFen);
  const { isPending, error, data } = useQuery<CloudEvaluationResponse>({
    queryKey: [`cloud-evaluation-${fen}`],
    queryFn: () =>
      fetch(`https://lichess.org/api/cloud-eval?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

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
          <FetchError error={error} />
        </td>
      </tr>
    );

  const chessopsPosition = parsePosition(fen);

  return (
    <>
      {data.pvs?.map((pv) => (
        <tr key={pv.moves}>
          <TdWithOverflowCaret>
            <Eval {...pv} /> {uciMovesToSan(chessopsPosition, pv.moves)}
          </TdWithOverflowCaret>
        </tr>
      ))}
    </>
  );
};
