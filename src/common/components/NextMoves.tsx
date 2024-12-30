import { useRepertoireStore } from "@/app/zustand/store.ts";
import { GoToMoveButton } from "@/common/components/GoToMoveButton.tsx";
import { takeWhile } from "lodash";
import { parseVariation } from "@/features/pgn/utils.ts";
import { selectPendingPromotionMove } from "@/features/chessboard/chessboardSlice.ts";

interface Props {
  variationOfNextMoves: string[];
  previousMoves: string[];
}

export const NextMoves = ({ variationOfNextMoves, previousMoves }: Props) => {
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
