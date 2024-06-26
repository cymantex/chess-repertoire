import { Chessboard } from "@/components/Chessboard/Chessboard.tsx";
import { RepertoireSidebar } from "@/components/RepertoireSidebar/RepertoireSidebar.tsx";
import { useResizableAppLayoutStyle } from "@/hooks/useResizableAppLayoutStyle.ts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts.ts";

import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectCurrentRepertoirePositionComment,
  selectFen,
} from "@/stores/zustand/selectors.ts";
import { CommentRichTextEditor } from "@/external/slate/CommentRichTextEditor.tsx";

export const RepertoireApp = () => {
  const fen = useRepertoireStore(selectFen);
  const positionComment =
    useRepertoireStore(selectCurrentRepertoirePositionComment) ?? "";

  useKeyboardShortcuts();

  return (
    <div
      className="md:grid ml-auto mr-auto p-0 md:p-3"
      style={useResizableAppLayoutStyle()}
    >
      <main>
        <Chessboard />
        <CommentRichTextEditor
          key={fen + positionComment}
          fen={fen}
          positionComment={positionComment}
        />
      </main>
      <RepertoireSidebar />
    </div>
  );
};
