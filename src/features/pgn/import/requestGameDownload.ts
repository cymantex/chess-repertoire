interface RequestOptions {
  site: string;
  username: string;
  signal: AbortSignal;
  accept: string;
  onProgress?: (bytesReceived: number) => void;
}

export const requestGameDownload = async (
  url: string,
  { site, username, signal, accept, onProgress }: RequestOptions,
) => {
  signal.throwIfAborted();
  const response = await fetch(url, { signal, headers: { Accept: accept } });
  if (response.status === 404) {
    throw new Error(
      `No public games found for ${username} on ${site}. Check the username.`,
    );
  }
  if (response.status === 429) {
    throw new Error(
      `${site} is limiting requests. Please wait a minute before trying again.`,
    );
  }
  if (!response.ok) {
    throw new Error(
      `${site} could not download the games (${response.status}). Please try again later.`,
    );
  }
  if (!onProgress || !response.body) return response;

  let bytesReceived = 0;
  const body = response.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        bytesReceived += chunk.byteLength;
        onProgress(bytesReceived);
        controller.enqueue(chunk);
      },
    }),
    { signal },
  );
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};
