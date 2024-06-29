import { useSlate } from "slate-react";
import { EditorButton, EditorButtonProps } from "./EditorButton.tsx";
import { ReactNode } from "react";
import { Format } from "./defs.ts";
import { isMarkActive, toggleMark } from "@/external/slate/utils.ts";

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
