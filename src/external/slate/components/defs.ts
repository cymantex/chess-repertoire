import type { Element, Node } from "slate";
import { BaseElement } from "slate";

export const FORMATS = {
  BOLD: "bold",
  CODE: "code",
  CHESS: "chess",
  ITALIC: "italic",
  UNDERLINE: "underline",
  HEADING_ONE: "heading-one",
  HEADING_TWO: "heading-two",
  NUMBERED_LIST: "numbered-list",
  BULLETED_LIST: "bulleted-list",
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
  JUSTIFY: "justify",
  PARAGRAPH: "paragraph",
  LIST_ITEM: "list-item",
} as const;

export const LIST_FORMATS = [
  FORMATS.NUMBERED_LIST,
  FORMATS.BULLETED_LIST,
] as const;

export const TEXT_ALIGN_FORMATS = [
  FORMATS.LEFT,
  FORMATS.CENTER,
  FORMATS.RIGHT,
  FORMATS.JUSTIFY,
] as const;

export type Format = (typeof FORMATS)[keyof typeof FORMATS];
export type ListFormat = (typeof LIST_FORMATS)[number];
export type TextAlignFormat = (typeof TEXT_ALIGN_FORMATS)[number];

export interface ExtraEditorNodeData {
  type?: Format;
  align?: TextAlignFormat;
  fontFamily?: string;
}
export type EditorElement = Partial<ExtraEditorNodeData> & BaseElement;
export type EditorNode = Partial<ExtraEditorNodeData> & Node;
export type EditorRenderElement = {
  element: Partial<ExtraEditorNodeData>;
} & Partial<Element>;

export const isListFormat = (format?: Format): format is ListFormat =>
  LIST_FORMATS.includes(format as ListFormat);

export const isTextAlignFormat = (format: Format): format is TextAlignFormat =>
  TEXT_ALIGN_FORMATS.includes(format as TextAlignFormat);

export const isChessFormat = (format: Format): format is "chess" =>
  format === FORMATS.CHESS;
