import { PgnMoveData } from "@/external/chessops/defs.ts";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectGoToPosition } from "@/stores/zustand/selectors.ts";

interface GoToMoveButtonProps<
  TMove extends Pick<PgnMoveData, "san" | "moveNumber">,
> {
  disabled: boolean;
  selected?: boolean;
  italic?: boolean;
  move: TMove;
  getVariation: (move: TMove) => string[] | undefined;
}

export const GoToMoveButton = <
  TMove extends Pick<PgnMoveData, "san" | "moveNumber">,
>({
  disabled,
  selected = false,
  italic = false,
  move,
  getVariation,
}: GoToMoveButtonProps<TMove>) => {
  const goToPosition = useRepertoireStore(selectGoToPosition);

  const handleGoToPosition = () => {
    const variation = getVariation(move);

    if (!variation) {
      toast.error("Unable to determine variation for clicked move");
      return;
    }

    return goToPosition(variation);
  };

  // TODO: Variation indentation level
  return (
    <button
      disabled={disabled}
      onClick={handleGoToPosition}
      className={classNames(
        "flex p-0.5 gap-1 pt-0.5 pb-0.5 rounded transition-all",
        {
          "cursor-not-allowed": disabled,
          "cursor-pointer": !disabled,
          "hover:text-accent-content": !disabled,
          "hover:bg-accent--dark": !disabled,
          italic,
          "text-accent-content--dark": italic && !selected,
          "bg-accent--dark": selected,
          "text-accent-content": selected,
        },
      )}
    >
      {move.moveNumber && <span>{move.moveNumber}</span>}
      <span>{move.san}</span>
    </button>
  );
};
