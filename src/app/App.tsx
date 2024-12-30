import React from "react";
import { Chessboard } from "@/features/chessboard/Chessboard.tsx";
import { RepertoireSidebar } from "@/features/sidebar/RepertoireSidebar.tsx";
import { useResizableAppLayoutStyle } from "@/app/hooks/useResizableAppLayoutStyle.ts";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts.ts";
import { CommentEditorContainer } from "@/features/comment-editor/CommentEditorContainer.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OptionalGoogleAuthProvider } from "@/features/google-drive/OptionalGoogleAuthProvider.tsx";
import { ToastContainer } from "react-toastify";
import { ModalContainer } from "@/common/components/Modal/ModalContainer.tsx";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

export const App = () => {
  useKeyboardShortcuts();

  return (
    <React.StrictMode>
      <OptionalGoogleAuthProvider>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </OptionalGoogleAuthProvider>
    </React.StrictMode>
  );
};
