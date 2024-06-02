import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { useQuery } from "@tanstack/react-query";
import { CloudEvaluationResponse } from "@/sidebar/types.ts";
import { useChessRepertoireStore } from "@/store/store.ts";
import { Loader } from "@/sidebar/components/Loader.tsx";
import { FetchError } from "@/sidebar/components/FetchError.tsx";
import { selectFen } from "@/store/selectors.ts";

export const CloudEngineEvaluation = () => {
  const fen = useChessRepertoireStore(selectFen);
  const { isPending, error, data } = useQuery<CloudEvaluationResponse>({
    queryKey: [`cloud-evaluation-${fen}`],
    queryFn: () =>
      fetch(`https://lichess.org/api/cloud-eval?fen=${fen}`).then((res) =>
        res.json(),
      ),
  });

  if (isPending) return <Loader />;
  if (error) return <FetchError error={error} />;

  const cpDisplayValue = (cp: number) => (
    <span className="font-bold">
      {cp < 0 ? `-0.${Math.abs(cp)}` : `+0.${cp}`}
    </span>
  );

  const chessopsPosition = parsePosition(fen);

  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <td>Cloud engine evaluation</td>
        </tr>
      </thead>
      <tbody>
        {data.pvs?.map((pv) => (
          <tr key={pv.moves}>
            <td className="whitespace-nowrap">
              {cpDisplayValue(pv.cp)}{" "}
              {uciMovesToSan(chessopsPosition, pv.moves)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
