import { selectFen, useRepertoireStore } from "@/app/zustand/store.ts";
import { useOpeningExplorerQuery } from "@/features/opening-explorer/useOpeningExplorerQuery.tsx";
import { IconButton } from "@/common/components/IconButton.tsx";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { TopGamesModal } from "@/features/opening-explorer/top-games/TopGamesModal.tsx";
import { FaChessBoard } from "react-icons/fa";
import classNames from "classnames";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

export const TopGamesButton = () => {
  const fen = useRepertoireStore(selectFen);
  const { isPending, error, data } = useOpeningExplorerQuery(fen);

  const topGames = data?.topGames ?? [];
  const disabled = isPending || !!error || topGames.length === 0;

  return (
    <Tooltip className="whitespace-nowrap" tooltip="Top games">
      <IconButton
        className={classNames({
          "text-base-content": !disabled,
          "transition-transform hover:scale-125": !disabled,
          "text-base-300 cursor-not-allowed": disabled,
        })}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            modalStore.setModal(
              <TopGamesModal
                id={MODAL_IDS.TOP_GAMES_MODAL}
                topGames={topGames}
              />,
            );
          }
        }}
      >
        <FaChessBoard />
      </IconButton>
    </Tooltip>
  );
};
