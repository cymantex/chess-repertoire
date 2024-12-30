import { useSlate } from "slate-react";
import type { EditorButtonProps } from "./EditorButton.tsx";
import { EditorButton } from "./EditorButton.tsx";
import type { ReactNode } from "react";
import type { Format } from "./defs.ts";
import { isMarkActive, toggleMark } from "./utils.ts";

interface MarkButtonProps extends Partial<EditorButtonProps> {
  format: Format;
  icon: ReactNode;
}

export const MarkButton = ({ format, icon, ...props }: MarkButtonProps) => {
  const editor = useSlate();
  return (
    <EditorButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      {...props}
    >
      {icon}
    </EditorButton>
  );
};
