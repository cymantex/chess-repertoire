import { extractPlayerNames } from "@/pgn/utils.ts";

interface PgnFileInputProps {
  onFileUpload: (file: File, playerNames: string[]) => void;
  disabled?: boolean;
}

export const PgnFileInput = ({ onFileUpload, disabled }: PgnFileInputProps) => (
  <input
    type="file"
    className="file-input file-input-ghost file-input-bordered w-full"
    disabled={disabled}
    onChange={(e) => {
      if (!e.target.files) return;
      const file = e.target.files[0];
      if (!file) return;

      file
        .slice(0, 1000)
        .text()
        .then(extractPlayerNames)
        .then((playerNames) => {
          onFileUpload(file, playerNames);
          console.warn(e.target.files);
        });
    }}
  />
);
