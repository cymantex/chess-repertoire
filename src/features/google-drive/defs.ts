import { Credential } from "@/features/google-drive/googleCredentialStore.ts";

export interface GoogleDriveFile {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
}

export interface TokenInfoResponse {
  azp: string;
  aud: string;
  sub: string;
  scope: string;
  exp: string;
  expires_in: string;
  email: string;
  email_verified: string;
  access_type: string;
}

interface UploadParams {
  repertoireBlob: Blob;
  accessToken: string;
}

export interface UpdateFileParams extends UploadParams {
  fileId: string;
}

export interface CreateFileParams extends UploadParams {
  fileName: string;
  mimeType: string;
}

export interface GoogleDriveLoginParams {
  isLoginRequired: (credential: Credential | null) => boolean;
  login: () => void;
}
