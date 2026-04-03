import React from "react";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OptionalGoogleAuthProvider } from "@/features/google-drive/OptionalGoogleAuthProvider.tsx";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import { LichessLoginManager } from "@/features/lichess-auth/LichessLoginManager.tsx";
import { LichessAuthProvider } from "@/features/lichess-auth/LichessAuthProvider.tsx";
import { ChessRepertoire } from "@/app/ChessRepertoire.tsx";

const queryClient = new QueryClient();

export const App = () => {
  useKeyboardShortcuts();

  return (
    <React.StrictMode>
      <OptionalGoogleAuthProvider>
        <QueryClientProvider client={queryClient}>
          <LichessAuthProvider>
            <LichessLoginManager>
              <ChessRepertoire />
            </LichessLoginManager>
          </LichessAuthProvider>
        </QueryClientProvider>
      </OptionalGoogleAuthProvider>
    </React.StrictMode>
  );
};
