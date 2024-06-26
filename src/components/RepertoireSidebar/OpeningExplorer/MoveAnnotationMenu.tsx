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
import {
  ANNOTATION_BACKGROUND_ACTIVE,
  ANNOTATION_LIST,
  ANNOTATION_SHAPE_ACTIVE,
  AnnotationProps,
  DEFAULT_ANNOTATION_STYLES,
} from "@/assets/annotation/defs.ts";
import {
  RepertoireMoveAnnotation,
  RepertoireOpeningExplorerMove,
} from "@/repertoire/defs.ts";
import { IconButton } from "@/components/reused/IconButton.tsx";

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
    (annotation: RepertoireMoveAnnotation): MouseEventHandler<SVGElement> =>
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

  const createAnnotationProps = (
    annotation: RepertoireMoveAnnotation,
  ): AnnotationProps => ({
    className: "transition-all hover:scale-150 rounded cursor-pointer",
    onClick: handleAnnotationClick(annotation),
    backgroundProps: {
      style:
        databaseMove?.annotation === annotation
          ? ANNOTATION_BACKGROUND_ACTIVE.style
          : DEFAULT_ANNOTATION_STYLES.background,
    },
    shapeProps: {
      style:
        databaseMove?.annotation === annotation
          ? ANNOTATION_SHAPE_ACTIVE.style
          : DEFAULT_ANNOTATION_STYLES.shape,
    },
  });

  return (
    <div
      className="flex gap-2 text-base cursor-default items-center w-max"
      onClick={(e) => e.stopPropagation()}
    >
      {ANNOTATION_LIST.map(({ SettingsIcon, id }) => (
        <SettingsIcon key={id} {...createAnnotationProps(id)} />
      ))}
      {databaseMove ? (
        <IconButton
          title="Delete move from repertoire"
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
      ) : (
        <FaTrash className="opacity-0" />
      )}
    </div>
  );
};
