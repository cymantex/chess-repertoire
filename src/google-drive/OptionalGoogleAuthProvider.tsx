import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";
import { useRepertoireSettings } from "@/stores/repertoireSettingsStore.ts";
import { GoogleDriveShortcuts } from "@/google-drive/GoogleDriveShortcuts.tsx";

interface OptionalGoogleAuthProviderProps {
  children: ReactNode;
}

export const OptionalGoogleAuthProvider = ({
  children,
}: OptionalGoogleAuthProviderProps) => {
  const repertoireSettings = useRepertoireSettings();

  if (!repertoireSettings.googleDriveEnabled) {
    return children;
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API_CLIENT_ID}>
      <GoogleDriveShortcuts />
      {children}
    </GoogleOAuthProvider>
  );
};
