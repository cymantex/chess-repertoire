import type { TokenResponse } from "@react-oauth/google";
import { getObject, upsertObject } from "local-storage-superjson";
import { isEqual } from "lodash";
import { useSyncExternalStore } from "react";

export interface Credential
  extends Omit<TokenResponse, "error" | "error_description" | "error_uri"> {
  email: string;
  issued_at: number;
}

export const getCredential = (): Credential | null =>
  getObject<Credential>("credential");

const subscribers = new Set<() => void>();
const notifySubscribers = () => subscribers.forEach((callback) => callback());
let currentCredential: Credential | null = getCredential();

export const googleCredentialStore = {
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  getSnapshot: (): Credential | null => {
    const credential = getCredential();

    if (isEqual(credential, currentCredential)) {
      return currentCredential;
    }

    currentCredential = credential;
    return credential;
  },
  upsertCredential: (credential: Credential) => {
    upsertObject<Credential>("credential", credential, () => credential);
    currentCredential = credential;
    notifySubscribers();
  },
  removeCredential: () => {
    localStorage.removeItem("credential");
    currentCredential = null;
    notifySubscribers();
  },
};

export const useGoogleCredential = () =>
  useSyncExternalStore(
    googleCredentialStore.subscribe,
    googleCredentialStore.getSnapshot,
  );
