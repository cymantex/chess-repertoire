import { Modal, ModalId } from "@/components/reused/Modal/Modal.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { TopGamesResponse } from "@/defs.ts";
import { orderBy } from "lodash";

interface TopGamesModalProps extends ModalId {
  topGames: TopGamesResponse[];
}

export const TopGamesModal = ({ id, topGames }: TopGamesModalProps) => (
  <Modal className="w-max max-w-5xl" id={id} show>
    <Modal.CloseButton onClick={() => modalStore.closeModal(id)} />
    <Modal.Title>Top games</Modal.Title>
    <table className="table table-sm table-zebra">
      <thead>
        <tr>
          <th>Date</th>
          <th>White</th>
          <th>Black</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {orderBy(topGames, (game) => game.month, "desc").map((game) => (
          <tr
            key={game.id}
            className="hover cursor-pointer"
            onClick={() =>
              window.open(`https://lichess.org/${game.id}`, "_blank")
            }
          >
            <td>{game.month}</td>
            <td>
              {game.white.name} ({game.white.rating})
            </td>
            <td>
              {game.black.name} ({game.black.rating})
            </td>
            <td>{toDisplayName(game.winner)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Modal>
);

const toDisplayName = (winner: string | null) => {
  if (winner === null) return "1/2-1/2";
  if (winner === "white") return "1-0";
  if (winner === "black") return "0-1";
  return "N/A";
};
