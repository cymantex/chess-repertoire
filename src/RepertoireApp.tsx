import { Chessboard } from "@/components/Chessboard/Chessboard.tsx";
import { CommentTextarea } from "@/components/CommentTextarea.tsx";
import { RepertoireSidebar } from "@/components/RepertoireSidebar/RepertoireSidebar.tsx";
import { useResizableAppLayoutStyle } from "@/hooks/useResizableAppLayoutStyle.ts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts.ts";

import { exportPgnAsync } from "@/utils/exportPgnAsync.ts";
import { importPgnAsync } from "@/external/chessops/pgn.ts";

export const RepertoireApp = () => {
  useKeyboardShortcuts();

  return (
    <div
      className="md:grid ml-auto mr-auto p-0 md:p-3"
      style={useResizableAppLayoutStyle()}
    >
      <main>
        <Chessboard />
        <CommentTextarea />
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
                  controller.enqueue(reader.result as ArrayBuffer);
                  controller.close();
                },
              });

              importPgnAsync(stream);
            };

            reader.readAsArrayBuffer(file);
          }}
        />
      </main>
      <RepertoireSidebar />
    </div>
  );
};
