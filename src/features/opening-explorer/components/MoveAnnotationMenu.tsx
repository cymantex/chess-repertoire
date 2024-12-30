import type { MouseEventHandler } from "react";
import { selectFen, useRepertoireStore } from "@/app/zustand/store.ts";
import classNames from "classnames";
import { FaTrash } from "react-icons/fa";
import { MOVE_ANNOTATION_LIST } from "@/features/annotations/annotations.tsx";
import type { RepertoireOpeningExplorerMove } from "@/features/repertoire/defs.ts";
import { IconButton } from "@/common/components/IconButton.tsx";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";
import type { MoveAnnotation } from "@/features/annotations/defs.ts";
import {
  selectCurrentRepertoirePositionMoves,
  selectDeleteMove,
  selectUpsertMove,
} from "@/features/repertoire/repertoireSlice.ts";

interface Props {
  move: RepertoireOpeningExplorerMove;
}

export const MoveAnnotationMenu = ({ move }: Props) => {
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
