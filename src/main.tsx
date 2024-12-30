import React from "react";
import ReactDOM from "react-dom/client";
import { RepertoireApp } from "./RepertoireApp.tsx";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalContainer } from "@/components/ModalContainer.tsx";
import { loadThemes } from "@/utils/utils.ts";
import { OptionalGoogleAuthProvider } from "@/google-drive/OptionalGoogleAuthProvider.tsx";
import { initializeRepertoireStore } from "@/stores/zustand/initialize.ts";
import { synchronizeDefaultSettings } from "@/stores/repertoireSettingsStore.ts";

const queryClient = new QueryClient();

synchronizeDefaultSettings();
loadThemes();
initializeRepertoireStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OptionalGoogleAuthProvider>
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
    </OptionalGoogleAuthProvider>
  </React.StrictMode>,
);
