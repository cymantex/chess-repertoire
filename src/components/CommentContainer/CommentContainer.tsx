import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectCurrentRepertoirePositionComments,
  selectFen,
  selectFetchingRepertoirePosition,
} from "@/stores/zustand/selectors.ts";
import { Editor } from "@/external/slate/Editor.tsx";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";
import { setRepertoirePositionComments } from "@/repertoire/repertoireRepository.ts";
import { toRichTextEditorFormat } from "@/external/slate/defs.ts";

/**
 * Exists mainly as an optimization to prevent unnecessary re-renders of the
 * App as the fen is updated.
 */
export const CommentContainer = () => {
  const fetchingRepertoirePosition = useRepertoireStore(
    selectFetchingRepertoirePosition,
  );
  const fen = useRepertoireStore(selectFen);
  const comments =
    useRepertoireStore(selectCurrentRepertoirePositionComments) ??
    toRichTextEditorFormat("");

  if (fetchingRepertoirePosition) return null;

  return (
    <HideOnMobile className=" mt-2">
      <Editor
        key={fen}
        initialValue={comments}
        onValueChange={(value) => setRepertoirePositionComments(fen, value)}
        placeholder="Add position comments here..."
      />
    </HideOnMobile>
  );
};
