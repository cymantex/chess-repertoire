import type { PgnMoveData } from "@/external/chessops/defs.ts";
import classNames from "classnames";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import { openErrorToast } from "@/external/react-toastify/toasts.ts";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";
import { MiniChessboard } from "@/features/chessboard/MiniChessboard.tsx";
import { selectGoToPosition } from "@/features/navigation/navigationSlice.ts";

interface Props<TMove extends Pick<PgnMoveData, "san" | "moveNumber">> {
  disabled: boolean;
  selected?: boolean;
  italic?: boolean;
  contextMenuOpen?: boolean;
  move: TMove;
  getVariation: (move: TMove) => string[] | undefined;
}

export const GoToMoveButton = <
  TMove extends Pick<PgnMoveData, "san" | "moveNumber">,
>({
  disabled,
  selected = false,
  italic = false,
  contextMenuOpen,
  move,
  getVariation,
}: Props<TMove>) => {
  const goToPosition = useRepertoireStore(selectGoToPosition);

  const handleGoToPosition = () => {
    const variation = getVariation(move);

    if (!variation) {
      openErrorToast("Unable to determine variation for clicked move");
      return;
    }

    return goToPosition(variation);
  };

  return (
    <Tooltip
      className="hidden md:block"
      renderTooltip={() => <MiniChessboard moves={getVariation(move)} />}
    >
      <button
        type="button"
        disabled={disabled}
        aria-haspopup={contextMenuOpen === undefined ? undefined : "menu"}
        aria-expanded={contextMenuOpen}
        aria-controls={contextMenuOpen ? "pgn-context-menu" : undefined}
        onClick={handleGoToPosition}
        className={classNames(
          "flex p-0.5 gap-1 pt-0.5 pb-0.5 rounded transition-all",
          {
            "cursor-not-allowed": disabled,
            "cursor-pointer": !disabled,
            "hover:text-accent-content": !disabled,
            "hover:bg-accent": !disabled,
            italic,
            "text-base-content/50": italic && !selected,
            "bg-accent": selected,
            "text-accent-content": selected,
          },
        )}
      >
        {move.moveNumber && <span>{move.moveNumber}</span>}
        <span>{move.san}</span>
      </button>
    </Tooltip>
  );
};
