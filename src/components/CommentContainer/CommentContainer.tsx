import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectCurrentRepertoirePositionComments,
  selectFen,
  selectFetchingRepertoirePosition,
} from "@/stores/zustand/selectors.ts";
import { Editor } from "@/external/slate/Editor.tsx";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";
import { setRepertoirePositionComments } from "@/repertoire/repository.ts";
import { toRichTextEditorFormat } from "@/external/slate/utils.ts";
import { APP_PADDING_REM } from "@/defs.ts";
import "./CommentContainer.scss";

const MARGIN_TOP_REM = 0.25;
const EDITOR_TOOLBAR_HEIGHT_REM = 2;
const HEIGHT_TO_SUBTRACT_REM =
  MARGIN_TOP_REM + EDITOR_TOOLBAR_HEIGHT_REM + APP_PADDING_REM * 2;

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
    <HideOnMobile className="mt-1">
      <Editor
        className="comment-editor"
        key={fen}
        initialValue={comments}
        onValueChange={(value) => setRepertoirePositionComments(fen, value)}
        label="Comment"
        style={{
          overflowY: `auto`,
          height: `calc(100vh - var(--cg-height) - ${HEIGHT_TO_SUBTRACT_REM}rem)`,
        }}
      />
    </HideOnMobile>
  );
};
