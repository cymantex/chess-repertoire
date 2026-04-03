import { SettingsMenuAlert } from "@/features/sidebar/settings/SettingsMenuAlert.tsx";
import { SettingsMenuButton } from "@/features/sidebar/settings/SettingsMenuButton.tsx";
import { useAuth } from "react-oidc-context";

export const LichessLogoutSettings = () => {
  const auth = useAuth();

  return (
    <>
      <SettingsMenuAlert title="Lichess account" />
      <SettingsMenuButton onClick={() => auth.removeUser()}>
        Logout
      </SettingsMenuButton>
    </>
  );
};
