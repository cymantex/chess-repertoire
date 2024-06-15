import { Chessboard } from "@/components/Chessboard/Chessboard.tsx";
import { CommentTextarea } from "@/components/CommentTextarea.tsx";
import { RepertoireSidebar } from "@/components/RepertoireSidebar/RepertoireSidebar.tsx";
import { useResizableAppLayoutStyle } from "@/hooks/useResizableAppLayoutStyle.ts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts.ts";

import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectCurrentRepertoirePositionComment,
  selectFen,
  selectGetCurrentRepertoirePosition,
} from "@/stores/zustand/selectors.ts";
import { useEffect } from "react";
import { PgnImport } from "@/components/Chessboard/PgnImport/PgnImport.tsx";
import { exportPgnAsync } from "@/pgn/export/exportPgnAsync.ts";

export const RepertoireApp = () => {
  const fen = useRepertoireStore(selectFen);
  const positionComment =
    useRepertoireStore(selectCurrentRepertoirePositionComment) ?? "";
  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  useKeyboardShortcuts();

  // TODO: Improve handling of initial data fetching
  useEffect(() => {
    getCurrentRepertoirePosition();
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
        <button className="hidden md:block" onClick={exportPgnAsync}>
          Export PGN
        </button>
        <PgnImport />
      </main>
      <RepertoireSidebar />
    </div>
  );
};
