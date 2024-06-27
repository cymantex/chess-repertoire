import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectCurrentRepertoirePositionComment,
  selectFen,
} from "@/stores/zustand/selectors.ts";
import { CommentTextarea } from "@/components/CommentTextarea.tsx";

/**
 * Exists mainly as an optimization to prevent unnecessary re-renders of the
 * App as the fen is updated.
 */
export const CommentContainer = () => {
  const fen = useRepertoireStore(selectFen);
  const positionComment =
    useRepertoireStore(selectCurrentRepertoirePositionComment) ?? "";

  return (
    <CommentTextarea
      key={fen + positionComment}
      fen={fen}
      positionComment={positionComment}
    />
  );
};
