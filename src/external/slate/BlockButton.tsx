import { useSlate } from "slate-react";
import { EditorButton, EditorButtonProps } from "./EditorButton.tsx";
import {
  BLOCK_TYPES,
  Format,
  TEXT_ALIGN_FORMATS,
  TextAlignFormat,
} from "./defs.ts";
import { ReactNode } from "react";
import { isBlockActive, toggleBlock } from "./utils.ts";

interface Props extends Partial<EditorButtonProps> {
  format: Format;
  icon: ReactNode;
}

export const BlockButton = ({ format, icon, ...props }: Props) => {
  const editor = useSlate();
  return (
    <EditorButton
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_FORMATS.includes(format as TextAlignFormat)
          ? BLOCK_TYPES.ALIGN
          : BLOCK_TYPES.TYPE,
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      {...props}
    >
      {icon}
    </EditorButton>
  );
};
