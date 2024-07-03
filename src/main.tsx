import React from "react";
import ReactDOM from "react-dom/client";
import { RepertoireApp } from "./RepertoireApp.tsx";
import "./assets/fonts/fonts.scss";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalContainer } from "@/components/ModalContainer.tsx";
import { loadThemes } from "@/utils/utils.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

loadThemes();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <RepertoireApp />
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
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
