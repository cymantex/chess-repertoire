import axios from "axios";
import {
  CreateFileParams,
  GoogleDriveFile,
  UpdateFileParams,
} from "@/google/defs.ts";

const updateFile = async ({
  fileId,
  repertoireBlob,
  accessToken,
}: UpdateFileParams) =>
  axios.patch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
    repertoireBlob,
    toAccessTokenHeader(accessToken),
  );

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

  return axios.put(
    uploadLocation!,
    repertoireBlob,
    toAccessTokenHeader(accessToken),
  );
};

const fetchFileByName = async (accessToken: string, fileName: string) => {
  const files = await fetchFiles(accessToken);
  return files.find((file) => file.name === fileName);
};

const fetchFiles = async (accessToken: string): Promise<GoogleDriveFile[]> =>
  axios
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
  axios
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
  fetchFileByName,
};
