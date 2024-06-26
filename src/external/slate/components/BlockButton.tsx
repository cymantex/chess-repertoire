import { useSlate } from "slate-react";
import { EditorButton } from "@/external/slate/components/EditorButton.tsx";
import {
  EditorElement,
  EditorNode,
  Format,
  isListFormat,
  isTextAlignFormat,
  TEXT_ALIGN_FORMATS,
  TextAlignFormat,
} from "@/external/slate/components/defs.ts";
import { BaseEditor, Editor, Element as SlateElement, Transforms } from "slate";
import { ReactNode } from "react";

interface BlockButtonProps {
  format: Format;
  icon: ReactNode;
}

export const BlockButton = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();
  return (
    <EditorButton
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_FORMATS.includes(format as TextAlignFormat)
          ? "align"
          : "type",
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </EditorButton>
  );
};

const toggleBlock = (editor: BaseEditor, format: Format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_FORMATS.includes(format as TextAlignFormat) ? "align" : "type",
  );
  const isList = isListFormat(format);

  Transforms.unwrapNodes(editor, {
    match: (node: EditorNode) =>
      node &&
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      isListFormat(node.type) &&
      !isTextAlignFormat(format),
    split: true,
  });

  const editorNode: Partial<EditorNode> = isTextAlignFormat(format)
    ? { align: isActive ? undefined : format }
    : { type: isActive ? "paragraph" : isList ? "list-item" : format };

  Transforms.setNodes<EditorNode>(editor, editorNode);

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    } as EditorElement);
  }
};

const isBlockActive = (
  editor: BaseEditor,
  format: Format,
  blockType: "align" | "type" = "type",
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes<EditorNode>(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: EditorNode) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    }),
  );

  return !!match;
};
