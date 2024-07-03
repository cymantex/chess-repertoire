/// <reference types="vite/client" />

import {
  CodeClientConfig,
  GsiButtonConfiguration,
  IdConfiguration,
  MomentListener,
  OverridableTokenClientConfig,
  TokenClientConfig,
  TokenResponse,
} from "@react-oauth/google";

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (input: IdConfiguration) => void;
          prompt: (momentListener?: MomentListener) => void;
          renderButton: (
            parent: HTMLElement,
            options: GsiButtonConfiguration,
          ) => void;
          disableAutoSelect: () => void;
          storeCredential: (
            credential: { id: string; password: string },
            callback?: () => void,
          ) => void;
          cancel: () => void;
          onGoogleLibraryLoad: () => void;
          revoke: (accessToken: string, done: () => void) => void;
        };
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => {
            requestAccessToken: (
              overridableClientConfig?: OverridableTokenClientConfig,
            ) => void;
          };
          initCodeClient: (config: CodeClientConfig) => {
            requestCode: () => void;
          };
          hasGrantedAnyScope: (
            tokenResponse: TokenResponse,
            firstScope: string,
            ...restScopes: string[]
          ) => boolean;
          hasGrantedAllScopes: (
            tokenResponse: TokenResponse,
            firstScope: string,
            ...restScopes: string[]
          ) => boolean;
          revoke: (accessToken: string, done?: () => void) => void;
        };
      };
    };
  }
}
