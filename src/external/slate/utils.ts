import { KeyboardEvent } from "react";
import {
  BLOCK_FORMATS,
  BLOCK_TYPES,
  BlockFormat,
  BlockType,
  Color,
  COLORS,
  EditorElement,
  EditorNode,
  Format,
  FORMATS,
  LIST_FORMATS,
  ListFormat,
  TEXT_ALIGN_FORMATS,
  TextAlignFormat,
} from "./defs.ts";
import { BaseEditor, Editor, Element as SlateElement, Transforms } from "slate";

export const isHotkey = (hotkeyString: string, event: KeyboardEvent) => {
  const tokens = hotkeyString.split("+");
  const hotkey = {
    mod: tokens.includes("mod"),
    shift: tokens.includes("shift"),
    alt: tokens.includes("alt"),
    key: tokens[tokens.length - 1],
  };
  const mod = event.ctrlKey || event.metaKey;

  if (mod !== hotkey.mod) return false;
  if (event.shiftKey !== hotkey.shift) return false;
  if (event.altKey !== hotkey.alt) return false;

  // Preferring event.code here as it is more reliable than event.key
  // For example shift+1 is "Digit1" in event.code and "!" in event.key
  let eventKey = event.code.toLowerCase();

  if (eventKey.startsWith("key")) {
    eventKey = eventKey.slice(3);
  } else if (eventKey.startsWith("digit")) {
    eventKey = eventKey.slice(5);
  }

  if (eventKey.length === 1 && /[a-z0-9]/.test(eventKey))
    return eventKey === hotkey.key.toLowerCase();

  return event.key.toLowerCase() === hotkey.key.toLowerCase();
};

export const isBlockFormat = (format?: Format): format is BlockFormat =>
  BLOCK_FORMATS.includes(format as ListFormat);

export const isListFormat = (format?: Format): format is ListFormat =>
  LIST_FORMATS.includes(format as ListFormat);

export const isTextAlignFormat = (format: Format): format is TextAlignFormat =>
  TEXT_ALIGN_FORMATS.includes(format as TextAlignFormat);

export const toRichTextEditorFormat = (text: string) => [
  {
    children: [{ text }],
  },
];

export const toggleMark = (
  editor: BaseEditor,
  format: Format,
  value: unknown = true,
) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value);
  }
};

export const isMarkActive = (editor: BaseEditor, format: Format) => {
  const marks = Editor.marks(editor) as unknown as Record<
    Format,
    boolean | unknown
  >;

  return marks ? !!marks[format] : false;
};

export const isColorFormat = (format: string): format is Color =>
  Object.values(COLORS).includes(format as Color);

export const toggleBlock = (editor: BaseEditor, format: Format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_FORMATS.includes(format as TextAlignFormat)
      ? BLOCK_TYPES.ALIGN
      : BLOCK_TYPES.TYPE,
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
    : {
        type: isActive
          ? FORMATS.PARAGRAPH
          : isList
            ? FORMATS.LIST_ITEM
            : format,
      };

  Transforms.setNodes<EditorNode>(editor, editorNode);

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    } as EditorElement);
  }
};

export const isBlockActive = (
  editor: BaseEditor,
  format: Format,
  blockType: BlockType = BLOCK_TYPES.TYPE,
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
