import type { BaseEditor } from "slate";
import { Editor, Element, Node, Range, Text, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { FORMATS } from "./defs.ts";

// Keep move numbers and surrounding punctuation outside the chess font.
const SAN_PATTERN =
  /(?:^|[\s([{"'“‘,:;—–])(?:\d+\.(?:\.\.)?\s*)?((?:O-O(?:-O)?|0-0(?:-0)?|[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h](?:x[a-h])?(?:[18]=[QRBN]|[2-7]))[+#]?[!?]{0,2})(?=$|[\s)\]}"'”’.,:;!?—–])/g;

export const formatChessNotation = (editor: BaseEditor) => {
  const ranges: Range[] = [];

  for (const [block, blockPath] of Editor.nodes(editor, {
    at: [],
    match: (node) =>
      Element.isElement(node) &&
      Editor.isBlock(editor, node) &&
      !Editor.isVoid(editor, node) &&
      Editor.hasInlines(editor, node),
  })) {
    const matches = Array.from(
      Node.string(block).matchAll(SAN_PATTERN),
      (match) => {
        const end = match.index + match[0].length;
        return { start: end - match[1].length, end };
      },
    );
    let offset = 0;

    // Match across leaves so existing bold, color, etc. cannot hide part of a move.
    for (const [leaf, leafPath] of Node.texts(block)) {
      const start = offset;
      offset += leaf.text.length;
      if (FORMATS.CHESS in leaf && leaf[FORMATS.CHESS]) continue;

      for (const match of matches) {
        const from = Math.max(start, match.start);
        const to = Math.min(offset, match.end);
        if (from >= to) continue;

        const path = [...blockPath, ...leafPath];
        ranges.push({
          anchor: { path, offset: from - start },
          focus: { path, offset: to - start },
        });
      }
    }
  }

  if (ranges.length === 0) return;

  const marks = Editor.marks(editor);
  const apply = () =>
    Editor.withoutNormalizing(editor, () => {
      // Work backwards so splitting a leaf cannot shift any remaining ranges.
      for (const range of ranges.reverse()) {
        Transforms.setNodes<Text & { chess: boolean }>(
          editor,
          { [FORMATS.CHESS]: true },
          { at: range, match: Text.isText, split: true },
        );
      }
    });

  if (HistoryEditor.isHistoryEditor(editor)) {
    HistoryEditor.withNewBatch(editor, apply);
  } else {
    apply();
  }

  // Formatting the move under the caret must not change the font used next.
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    editor.marks = marks;
  }
};
