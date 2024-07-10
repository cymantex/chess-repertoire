import { MouseEventHandler } from "react";
import {
  selectCurrentRepertoirePositionMoves,
  selectDeleteMove,
  selectFen,
  selectUpsertMove,
} from "@/stores/zustand/selectors.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import classNames from "classnames";
import { FaTrash } from "react-icons/fa";
import { MOVE_ANNOTATION_LIST } from "@/annotations/annotations.tsx";
import { RepertoireOpeningExplorerMove } from "@/repertoire/defs.ts";
import { IconButton } from "@/components/reused/IconButton.tsx";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";
import { MoveAnnotation } from "@/annotations/defs.ts";

interface MoveAnnotationMenuProps {
  move: RepertoireOpeningExplorerMove;
}

export const MoveAnnotationMenu = ({ move }: MoveAnnotationMenuProps) => {
  const fen = useRepertoireStore(selectFen);
  const upsertMove = useRepertoireStore(selectUpsertMove);
  const deleteMove = useRepertoireStore(selectDeleteMove);
  const repertoireMoves =
    useRepertoireStore(selectCurrentRepertoirePositionMoves) ?? [];
  const databaseMove = repertoireMoves.find(({ san }) => san === move.san);

  const handleAnnotationClick =
    (annotation: MoveAnnotation): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      return upsertMove(
        fen,
        {
          san: move.san,
          annotation:
            annotation === databaseMove?.annotation ? undefined : annotation,
        },
        annotation,
      );
    };

  return (
    <div
      className="flex gap-2 text-base cursor-default items-center w-max"
      onClick={(e) => e.stopPropagation()}
    >
      {MOVE_ANNOTATION_LIST.map(({ AnnotationIconButton, id }) => (
        <AnnotationIconButton
          key={id}
          onClick={handleAnnotationClick(id)}
          className={classNames(
            "transition-all hover:scale-150 cursor-pointer",
            {
              "bg-secondary": databaseMove?.annotation !== id,
              "bg-accent": databaseMove?.annotation === id,
            },
          )}
        />
      ))}
      {databaseMove ? (
        <Tooltip
          containerClassName="flex"
          tooltip="Delete move"
          className="whitespace-nowrap"
        >
          <IconButton
            className={classNames(
              "transition-all hover:scale-150 rounded cursor-pointer",
              {
                "opacity-0": !databaseMove,
              },
            )}
            onClick={() => deleteMove(fen, move.san)}
          >
            <FaTrash />
          </IconButton>
        </Tooltip>
      ) : (
        <FaTrash className="opacity-0" />
      )}
    </div>
  );
};
