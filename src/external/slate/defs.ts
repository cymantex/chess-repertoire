import type { Element, Node } from "slate";
import type { BaseElement } from "slate";
import type { RenderElementProps } from "slate-react/dist/components/editable";

export const FORMATS = {
  BOLD: "bold",
  CODE: "code",
  CHESS: "chess",
  COLOR: "color",
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
  IMAGE: "image",
  VIDEO: "video",
  LIST_ITEM: "list-item",
} as const;

export const COLORS = {
  GREEN: "oklch(var(--su))",
  RED: "oklch(var(--er))",
  BLUE: "oklch(var(--in))",
  YELLOW: "oklch(var(--wa))",
} as const;

export const HOTKEYS = {
  [FORMATS.CHESS]: "mod+<",
  [FORMATS.BOLD]: "mod+b",
  [FORMATS.ITALIC]: "mod+i",
  [FORMATS.CODE]: "mod+0",
  [COLORS.GREEN]: "alt+g",
  [COLORS.RED]: "alt+r",
  [COLORS.BLUE]: "alt+b",
  [COLORS.YELLOW]: "alt+y",
  [FORMATS.UNDERLINE]: "mod+u",
  [FORMATS.HEADING_ONE]: "mod+alt+1",
  [FORMATS.HEADING_TWO]: "mod+alt+2",
  [FORMATS.NUMBERED_LIST]: "mod+alt+n",
  [FORMATS.BULLETED_LIST]: "mod+alt+b",
  [FORMATS.LEFT]: "mod+alt+l",
  [FORMATS.CENTER]: "mod+alt+c",
  [FORMATS.RIGHT]: "mod+alt+r",
  [FORMATS.JUSTIFY]: "mod+alt+j",
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

export const BLOCK_FORMATS = [
  ...LIST_FORMATS,
  ...TEXT_ALIGN_FORMATS,
  FORMATS.HEADING_ONE,
  FORMATS.HEADING_TWO,
  FORMATS.PARAGRAPH,
] as const;

export const BLOCK_TYPES = {
  TYPE: "type",
  ALIGN: "align",
} as const;

export type Color = (typeof COLORS)[keyof typeof COLORS];

export type BlockType = (typeof BLOCK_TYPES)[keyof typeof BLOCK_TYPES];
export type Format = (typeof FORMATS)[keyof typeof FORMATS];
export type BlockFormat = (typeof BLOCK_FORMATS)[number];
export type ListFormat = (typeof LIST_FORMATS)[number];
export type TextAlignFormat = (typeof TEXT_ALIGN_FORMATS)[number];

export interface ExtraEditorNodeData {
  type?: Format;
  align?: TextAlignFormat;
  url?: string;
}

export type EditorNode = Partial<ExtraEditorNodeData> & Node;
export type EditorElement = BaseElement & ExtraEditorNodeData;
type RenderEditorElement = { element: EditorElement } & Partial<Element>;
export type ElementProps = RenderEditorElement & Partial<RenderElementProps>;
