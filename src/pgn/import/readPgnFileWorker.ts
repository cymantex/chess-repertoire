self.onmessage = async (event: MessageEvent<File>) => {
  const file = event.data;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const pgn = event.target!.result as string;
    self.postMessage(pgn);
  };
  reader.onerror = (err) => {
    throw err;
  };
  reader.readAsText(file);
};
