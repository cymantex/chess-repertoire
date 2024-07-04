export interface GoogleDriveFile {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
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
