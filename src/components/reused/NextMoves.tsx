import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectPendingPromotionMove } from "@/stores/zustand/selectors.ts";
import { GoToMoveButton } from "@/components/reused/GoToMoveButton.tsx";
import { takeWhile } from "lodash";
import { parseVariation } from "@/pgn/utils.ts";

interface NextMovesProps {
  variationOfNextMoves: string[];
  previousMoves: string[];
}

export const NextMoves = ({
  variationOfNextMoves,
  previousMoves,
}: NextMovesProps) => {
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);
  const moves = parseVariation(variationOfNextMoves);

  return (
    <>
      {moves.map((move, i) => (
        <GoToMoveButton
          key={i}
          disabled={!!pendingPromotionMove}
          move={move}
          getVariation={() => [
            ...previousMoves,
            ...takeWhile(moves, (m) => m.id !== move.id).map(
              (move) => move.san,
            ),
            move.san,
          ]}
        />
      ))}
    </>
  );
};
