import { expect, test } from "vitest";
import type { Descendant } from "slate";
import { createEditor, Editor, Node, Transforms } from "slate";
import { withHistory } from "slate-history";
import { formatChessNotation } from "@/external/slate/formatChessNotation.ts";
import { FORMATS } from "@/external/slate/defs.ts";
import type { EditorElement } from "@/external/slate/defs.ts";

const makeEditor = (children: Descendant[]) => {
  const editor = withHistory(createEditor());
  editor.children = children;
  editor.isVoid = (element: EditorElement) => element.type === FORMATS.IMAGE;
  return editor;
};

const chessText = (editor: Editor) =>
  Array.from(Node.texts(editor))
    .filter(([leaf]) => "chess" in leaf && leaf.chess)
    .map(([leaf]) => leaf.text);

test("formats SAN throughout prose, variations and numbered move lists", () => {
  const text =
    "Try 1.e4 e5 2.Nf3 Nc6, then (3.Bb5 a6). " +
    "After 3...Nf6, consider exd5!; Raxd1, R1e2, Qh4e1+, Kxf2, " +
    "O-O, O-O-O#, 0-0, 0-0-0, e8=Q+, exd8=N# or bxa1=R?!";
  const editor = makeEditor([{ children: [{ text }] }]);

  formatChessNotation(editor);

  expect(chessText(editor)).toEqual([
    "e4",
    "e5",
    "Nf3",
    "Nc6",
    "Bb5",
    "a6",
    "Nf6",
    "exd5!",
    "Raxd1",
    "R1e2",
    "Qh4e1+",
    "Kxf2",
    "O-O",
    "O-O-O#",
    "0-0",
    "0-0-0",
    "e8=Q+",
    "exd8=N#",
    "bxa1=R?!",
  ]);
  expect(Node.string(editor)).toBe(text);
});

test("leaves ordinary text, partial tokens, URLs and malformed moves alone", () => {
  const editor = makeEditor([
    {
      children: [
        {
          text:
            "Be careful: abc4 B2 Nf9 e0 nf3 Pe4 e4=Q e4e5 Nf3ish _e4 " +
            "https://example.com/e4 someone@e4.com 1-0 0-1 1/2-1/2",
        },
      ],
    },
  ]);
  const original = structuredClone(editor.children);

  formatChessNotation(editor);

  expect(editor.children).toEqual(original);
  expect(editor.history.undos).toHaveLength(0);
});

test("handles moves split across marks without losing formatting or manual chess text", () => {
  const children = [
    {
      children: [
        { text: "Play N", bold: true },
        { text: "f3", italic: true },
        { text: " or e4", color: "red" },
        { text: " and " },
        { text: "my custom notation", chess: true },
        { text: "." },
      ],
    },
  ];
  const editor = makeEditor(children);

  formatChessNotation(editor);

  expect(editor.children).toEqual([
    {
      children: [
        { text: "Play ", bold: true },
        { text: "N", bold: true, chess: true },
        { text: "f3", italic: true, chess: true },
        { text: " or ", color: "red" },
        { text: "e4", color: "red", chess: true },
        { text: " and " },
        { text: "my custom notation", chess: true },
        { text: "." },
      ],
    },
  ]);
  const operations = editor.operations.length;
  formatChessNotation(editor);
  expect(editor.operations).toHaveLength(operations);
});

test("scans headings and nested lists, skips images and never joins separate blocks", () => {
  const editor = makeEditor([
    { type: FORMATS.HEADING_ONE, children: [{ text: "After e4" }] },
    {
      type: FORMATS.BULLETED_LIST,
      children: [
        { type: FORMATS.LIST_ITEM, children: [{ text: "Play Nf3." }] },
        { type: FORMATS.LIST_ITEM, children: [{ text: "Or Nc3." }] },
      ],
    },
    {
      type: FORMATS.IMAGE,
      url: "data:image/png;base64,test",
      children: [{ text: "" }],
    },
    { children: [{ text: "N" }] },
    { children: [{ text: "f3" }] },
  ] as EditorElement[]);
  const image = structuredClone(editor.children[2]);

  formatChessNotation(editor);

  expect(chessText(editor)).toEqual(["e4", "Nf3", "Nc3", "f3"]);
  expect(editor.children[2]).toEqual(image);
  expect(editor.children[3]).toEqual({ children: [{ text: "N" }] });
});

test("preserves the selection and lets one undo restore the whole comment", () => {
  const editor = makeEditor([{ children: [{ text: "Try e4 or Nf3" }] }]);
  Transforms.select(editor, Editor.end(editor, []));
  Transforms.insertText(editor, " today.");
  const original = structuredClone(editor.children);
  Transforms.select(editor, {
    anchor: { path: [0, 0], offset: 16 },
    focus: { path: [0, 0], offset: 5 },
  });
  const originalSelection = structuredClone(editor.selection);
  const selectedText = Editor.string(editor, editor.selection!);

  formatChessNotation(editor);

  expect(chessText(editor)).toEqual(["e4", "Nf3"]);
  expect(Editor.string(editor, editor.selection!)).toBe(selectedText);
  expect(editor.history.undos).toHaveLength(2);
  const formatted = structuredClone(editor.children);
  editor.undo();
  expect(editor.children).toEqual(original);
  expect(editor.selection).toEqual(originalSelection);
  editor.redo();
  expect(editor.children).toEqual(formatted);
});

test("keeps Unicode text and the caret in place while formatting", () => {
  const editor = makeEditor([
    { children: [{ text: "♟️ Try ‘Nf3’ — e4! Then continue." }] },
  ]);
  Transforms.select(editor, Editor.end(editor, []));

  formatChessNotation(editor);
  Editor.insertText(editor, " More prose.");

  expect(chessText(editor)).toEqual(["Nf3", "e4!"]);
  expect(Node.string(editor)).toBe(
    "♟️ Try ‘Nf3’ — e4! Then continue. More prose.",
  );
});

test("typing after a newly formatted move keeps the previous typing style", () => {
  const children = [{ children: [{ text: "Consider e4", bold: true }] }];
  const editor = makeEditor(children);
  Transforms.select(editor, Editor.end(editor, []));

  formatChessNotation(editor);
  Editor.insertText(editor, " to claim the center.");

  expect(editor.children).toEqual([
    {
      children: [
        { text: "Consider ", bold: true },
        { text: "e4", bold: true, chess: true },
        { text: " to claim the center.", bold: true },
      ],
    },
  ]);
});
