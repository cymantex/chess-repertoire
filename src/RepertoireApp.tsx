import { Chessboard } from "@/components/Chessboard/Chessboard.tsx";
import { CommentTextarea } from "@/components/CommentTextarea.tsx";
import { RepertoireSidebar } from "@/components/RepertoireSidebar/RepertoireSidebar.tsx";
import { useResizableAppLayoutStyle } from "@/hooks/useResizableAppLayoutStyle.ts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts.ts";

import { exportPgnAsync } from "@/utils/pgn.ts";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import {
  selectCurrentRepertoirePositionComment,
  selectFen,
  selectGetCurrentRepertoirePositionData,
} from "@/store/selectors.ts";
import { useEffect } from "react";
import { PgnImport } from "@/components/Chessboard/PgnImport/PgnImport.tsx";

export const RepertoireApp = () => {
  const fen = useRepertoireStore(selectFen);
  const positionComment =
    useRepertoireStore(selectCurrentRepertoirePositionComment) ?? "";
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
        <button className="hidden md:block" onClick={exportPgnAsync}>
          Export PGN
        </button>
        <PgnImport />
      </main>
      <RepertoireSidebar />
    </div>
  );
};
