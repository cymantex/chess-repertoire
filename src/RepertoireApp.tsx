import { Chessboard } from "@/components/Chessboard/Chessboard.tsx";
import { CommentTextarea } from "@/components/CommentTextarea.tsx";
import { RepertoireSidebar } from "@/components/RepertoireSidebar/RepertoireSidebar.tsx";
import { useResizableAppLayoutStyle } from "@/hooks/useResizableAppLayoutStyle.ts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts.ts";

import { exportPgnAsync } from "@/utils/exportPgnAsync.ts";
import { importPgnAsync } from "@/external/chessops/pgn.ts";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import {
  selectFen,
  selectGetCurrentRepertoirePositionData,
  useCurrentRepertoirePositionComment,
} from "@/store/selectors.ts";
import { useEffect } from "react";

export const RepertoireApp = () => {
  const fen = useRepertoireStore(selectFen);
  const positionComment = useCurrentRepertoirePositionComment();
  const getCurrentRepertoirePositionData = useRepertoireStore(
    selectGetCurrentRepertoirePositionData,
  );

  useKeyboardShortcuts();

  // TODO: Improve handling of initial data fetching
  useEffect(() => {
    getCurrentRepertoirePositionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="md:grid ml-auto mr-auto p-0 md:p-3"
      style={useResizableAppLayoutStyle()}
    >
      <main>
        <Chessboard />
        <CommentTextarea
          key={fen + positionComment}
          fen={fen}
          positionComment={positionComment}
        />
        <button onClick={() => exportPgnAsync()}>Export PGN</button>
        <input
          type="file"
          className="file-input file-input-ghost w-full max-w-xs"
          onChange={(e) => {
            if (!e.target.files) return;
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
              const stream = new ReadableStream({
                start(controller) {
                  controller.enqueue(
                    new TextEncoder().encode(reader.result as string),
                  );
                  controller.close();
                },
              });

              return importPgnAsync(stream);
            };

            reader.readAsText(file);
          }}
        />
      </main>
      <RepertoireSidebar />
    </div>
  );
};
