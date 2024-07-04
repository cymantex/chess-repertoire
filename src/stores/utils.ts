import { Credential } from "@/stores/googleCredentialStore.ts";

export const hasExpired = (
  credential: Pick<Credential, "issued_at" | "expires_in">,
) => Date.now() - credential.issued_at > credential.expires_in * 1000;
