import type { AuthProviderProps } from "react-oidc-context";
import { AuthProvider } from "react-oidc-context";
import type { PropsWithChildren } from "react";

const lichessHost = "https://lichess.org";

const redirectUri = (() => {
  const url = new URL(location.href);
  url.search = "";
  return url.href;
})();

const lichessOidcConfig: AuthProviderProps = {
  authority: lichessHost,
  client_id: "cymantex.github.io",
  scope: " ",
  redirect_uri: redirectUri,
  response_type: "code",
  // Lichess is a plain OAuth2 + PKCE provider, not a full OIDC provider.
  // Provide endpoint metadata manually to skip OIDC discovery
  // (Lichess does not serve .well-known/openid-configuration).
  metadata: {
    issuer: lichessHost,
    authorization_endpoint: `${lichessHost}/oauth`,
    token_endpoint: `${lichessHost}/api/token`,
    revocation_endpoint: `${lichessHost}/api/token`,
  },
  loadUserInfo: false,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export const LichessAuthProvider = ({ children }: PropsWithChildren) => (
  <AuthProvider {...lichessOidcConfig}>{children}</AuthProvider>
);
