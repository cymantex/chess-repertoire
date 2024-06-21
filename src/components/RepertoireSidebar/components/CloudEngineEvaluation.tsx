import { parsePosition, uciMovesToSan } from "@/external/chessops/utils.ts";
import { useQuery } from "@tanstack/react-query";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { Loader } from "@/components/reused/Loader.tsx";
import { FetchError } from "@/components/reused/FetchError.tsx";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { CloudEvaluationResponse } from "@/defs.ts";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";
import { Eval } from "@/components/reused/Eval.tsx";
import { TdWithOverflowCaret } from "@/components/reused/TdWithOverflowCaret.tsx";
import { AccordingTable } from "@/components/reused/AccordingTable.tsx";
import { TOGGLE_SECTIONS } from "@/repertoire/defs.ts";

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

  const chessopsPosition = parsePosition(fen);

  return (
    <HideOnMobile>
      <AccordingTable
        section={TOGGLE_SECTIONS.CLOUD_ENGINE_EVALUATION}
        renderTheadTrChildren={(toggleButton) => (
          <td>
            <span>Cloud engine evaluation</span>
            {toggleButton}
          </td>
        )}
      >
        {data.pvs?.map((pv) => (
          <tr key={pv.moves}>
            <TdWithOverflowCaret>
              <Eval {...pv} /> {uciMovesToSan(chessopsPosition, pv.moves)}
            </TdWithOverflowCaret>
          </tr>
        ))}
      </AccordingTable>
    </HideOnMobile>
  );
};
