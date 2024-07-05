import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { useOpeningExplorerQuery } from "@/components/RepertoireSidebar/OpeningExplorer/useOpeningExplorerQuery.tsx";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { TopGamesModal } from "@/components/RepertoireSidebar/OpeningExplorer/TopGamesModal.tsx";
import { MODAL_IDS } from "@/defs.ts";
import { FaChessBoard } from "react-icons/fa";
import classNames from "classnames";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";

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
