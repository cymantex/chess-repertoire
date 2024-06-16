import React from "react";
import ReactDOM from "react-dom/client";
import { RepertoireApp } from "./RepertoireApp.tsx";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RepertoireSettings, SETTINGS_KEY } from "@/repertoire/defs.ts";
import { getObject } from "local-storage-superjson";
import { ModalContainer } from "@/components/ModalContainer.tsx";

const queryClient = new QueryClient();

const theme = getObject<RepertoireSettings>(SETTINGS_KEY)?.theme ?? "black";
document.documentElement.setAttribute("data-theme", theme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
  </React.StrictMode>,
);
