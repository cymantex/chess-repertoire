import { useResizableAppLayoutStyle } from "@/app/hooks/useResizableAppLayoutStyle.ts";
import { Chessboard } from "@/features/chessboard/Chessboard.tsx";
import { CommentEditorContainer } from "@/features/comment-editor/CommentEditorContainer.tsx";
import { RepertoireSidebar } from "@/features/sidebar/RepertoireSidebar.tsx";
import { ToastContainer } from "react-toastify";
import { ModalContainer } from "@/common/components/Modal/ModalContainer.tsx";
import { isMobileSize } from "@/common/utils/utils.ts";

export const ChessRepertoire = () => (
  <>
    <div
      className="md:grid ml-auto mr-auto p-0 md:p-3"
      style={useResizableAppLayoutStyle()}
    >
      <main>
        <Chessboard />
        {!isMobileSize() && (
          <div className="mt-1">
            <CommentEditorContainer />
          </div>
        )}
      </main>
      <RepertoireSidebar />
    </div>
    <ToastContainer
      position="bottom-right"
      autoClose={false}
      hideProgressBar
      newestOnTop
      closeOnClick
      theme="dark"
    />
    <ModalContainer />
  </>
);
