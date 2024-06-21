import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { useQuery } from "@tanstack/react-query";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { Loader } from "@/components/reused/Loader.tsx";
import { FetchError } from "@/components/reused/FetchError.tsx";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { CloudEvaluationResponse } from "@/defs.ts";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";

export const CloudEngineEvaluation = () => {
  const fen = useRepertoireStore(selectFen);
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
      {cp < 0 ? `${(cp / 100).toFixed(2)}` : `+${(cp / 100).toFixed(2)}`}
    </span>
  );

  const chessopsPosition = parsePosition(fen);

  return (
    <HideOnMobile>
      <table className="table table-xs">
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
    </HideOnMobile>
  );
};
