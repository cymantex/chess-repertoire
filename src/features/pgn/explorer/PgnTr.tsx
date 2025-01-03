import { PGN_TOKEN_TYPES } from "@/external/chessops/makePgnMoveTokens.ts";
import { useInteractivePgn } from "@/features/pgn/explorer/useInteractivePgn.ts";
import { GoToMoveButton } from "@/common/components/GoToMoveButton.tsx";

export const PgnTr = () => {
  const { pgnMoveTokens, disabled, isSelectedMove, getVariation } =
    useInteractivePgn();

  if (pgnMoveTokens.length === 0) return null;

  let variationCount = 0;

  return (
    <tr className="font-chess">
      <td>
        <div className="flex flex-wrap text-sm select-none">
          {pgnMoveTokens.map((token, i) => {
            if (token.type === PGN_TOKEN_TYPES.START_VARIATION) {
              variationCount++;
            } else if (token.type === PGN_TOKEN_TYPES.END_VARIATION) {
              variationCount--;
            }

            const moveOrString = token.value;

            if (typeof moveOrString === "string") {
              return (
                <span className="text-base-content/50" key={i}>
                  {moveOrString}
                </span>
              );
            }

            return (
              <GoToMoveButton
                key={i}
                disabled={disabled}
                italic={variationCount > 0}
                selected={isSelectedMove(moveOrString)}
                move={moveOrString}
                getVariation={getVariation}
              />
            );
          })}
        </div>
      </td>
    </tr>
  );
};
