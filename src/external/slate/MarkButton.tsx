import { BaseEditor, Editor } from "slate";
import { useSlate } from "slate-react";
import { EditorButton, EditorButtonProps } from "./EditorButton.tsx";
import { ReactNode } from "react";
import { Format } from "./defs.ts";

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

const toggleMark = (editor: BaseEditor, format: Format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: BaseEditor, format: Format) => {
  const marks = Editor.marks(editor) as unknown as Record<
    Format,
    boolean | unknown
  >;

  return marks ? marks[format] === true : false;
};
