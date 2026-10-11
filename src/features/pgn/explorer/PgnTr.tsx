import { startingPosition } from "chessops/pgn";
import { useInteractivePgn } from "@/features/pgn/explorer/useInteractivePgn.ts";
import { PgnContextMenu } from "./PgnContextMenu.tsx";
import { PgnMoves } from "./PgnMoves.tsx";
import { usePgnContextMenu } from "./usePgnContextMenu.ts";
import "./PgnTr.scss";

export const PgnTr = () => {
  const { pgn, disabled, isSelectedMove } = useInteractivePgn();
  const position = startingPosition(pgn.headers).unwrap();
  const initialPly =
    (position.fullmoves - 1) * 2 + Number(position.turn === "black");
  const { menuTarget, openMenu, closeMenu, handleKeyDown } = usePgnContextMenu(
    initialPly,
    disabled,
  );

  if (pgn.moves.children.length === 0) return null;

  return (
    <tr className="font-chess">
      <td>
        <div
          className="pgn-tree pgn-line text-sm select-none"
          onContextMenu={openMenu}
          onDoubleClick={openMenu}
          onKeyDown={handleKeyDown}
        >
          <PgnMoves
            nodes={pgn.moves.children}
            initialPly={initialPly}
            disabled={disabled}
            isSelectedMove={isSelectedMove}
            contextMenuPath={menuTarget?.path.join(" ")}
          />
        </div>
        {menuTarget && !disabled && (
          <PgnContextMenu target={menuTarget} onClose={closeMenu} />
        )}
      </td>
    </tr>
  );
};
