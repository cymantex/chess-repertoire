import axios from "axios";

interface GoogleDriveFile {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
}

interface UploadParams {
  repertoireBlob: Blob;
  accessToken: string;
}

interface UpdateFileParams extends UploadParams {
  fileId: string;
}

interface CreateFileParams extends UploadParams {
  fileName: string;
  mimeType: string;
}

const updateFile = async ({
  fileId,
  repertoireBlob,
  accessToken,
}: UpdateFileParams) => {
  await axios.patch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
    repertoireBlob,
    toAccessTokenHeader(accessToken),
  );
};

const createFile = async ({
  fileName,
  mimeType,
  repertoireBlob,
  accessToken,
}: CreateFileParams) => {
  const uploadLocation = await fetchUploadLocation({
    fileName: fileName,
    mimeType: mimeType,
    accessToken: accessToken,
  });

  await axios.put(
    uploadLocation!,
    repertoireBlob,
    toAccessTokenHeader(accessToken),
  );
};

const fetchFiles = async (accessToken: string) =>
  await axios
    .get<{
      files: GoogleDriveFile[];
    }>(
      "https://www.googleapis.com/drive/v3/files",
      toAccessTokenHeader(accessToken),
    )
    .then((res) => res.data.files);

const fetchUploadLocation = async ({
  fileName,
  mimeType,
  accessToken,
}: Omit<CreateFileParams, "repertoireBlob">) =>
  await axios
    .post(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
      {
        name: fileName,
        mimeType,
      },
      toAccessTokenHeader(accessToken),
    )
    .then((response) => {
      if (!response?.headers?.location) {
        throw new Error("No upload location found in response.");
      }

      return response.headers.location;
    });

const toAccessTokenHeader = (accessToken: string) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const googleDriveApi = {
  createFile,
  updateFile,
  fetchFiles,
};
