import { Chessboard } from "@/components/Chessboard/Chessboard.tsx";
import { RepertoireSidebar } from "@/components/RepertoireSidebar/RepertoireSidebar.tsx";
import { useResizableAppLayoutStyle } from "@/hooks/useResizableAppLayoutStyle.ts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts.ts";
import { CommentContainer } from "@/components/CommentContainer/CommentContainer.tsx";

export const RepertoireApp = () => {
  useKeyboardShortcuts();

  return (
    <div
      className="md:grid ml-auto mr-auto p-0 md:p-3"
      style={useResizableAppLayoutStyle()}
    >
      <main>
        <Chessboard />
        <CommentContainer />
      </main>
      <RepertoireSidebar />
    </div>
  );
};
