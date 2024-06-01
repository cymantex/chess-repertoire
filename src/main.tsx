import React from "react";
import ReactDOM from "react-dom/client";
import { ChessRepertoireApp } from "./ChessRepertoireApp.tsx";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChessRepertoireApp />
    </QueryClientProvider>
  </React.StrictMode>,
);
