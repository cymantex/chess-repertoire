import { useResizableAppLayoutStyle } from "@/app/hooks/useResizableAppLayoutStyle.ts";
import { Chessboard } from "@/features/chessboard/Chessboard.tsx";
import { CommentEditorContainer } from "@/features/comment-editor/CommentEditorContainer.tsx";
import { RepertoireSidebar } from "@/features/sidebar/RepertoireSidebar.tsx";
import { ToastContainer } from "react-toastify";
import { ModalContainer } from "@/common/components/Modal/ModalContainer.tsx";

export const ChessRepertoire = () => (
  <>
    <div
      className="md:grid ml-auto mr-auto p-0 md:p-3"
      style={useResizableAppLayoutStyle()}
    >
      <main>
        <Chessboard />
        <CommentEditorContainer />
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
