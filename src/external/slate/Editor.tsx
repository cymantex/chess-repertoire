// @refresh reset
import { createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import { Element } from "./Element.tsx";
import { Leaf, LeafProps } from "./Leaf.tsx";
import { EditorToolbar } from "./EditorToolbar.tsx";
import { EditableProps } from "slate-react/dist/components/editable";
import { ElementProps, Format, FORMATS, HOTKEYS } from "./defs.ts";

import {
  isBlockFormat,
  isColorFormat,
  isHotkey,
  toggleBlock,
  toggleMark,
} from "./utils.ts";
import { withImages } from "./image/withImages.tsx";
import classNames from "classnames";

interface EditorProps extends Partial<EditableProps> {
  initialValue: Descendant[];
  onValueChange: (value: Descendant[]) => void;
  label?: string;
}

export const Editor = ({
  className,
  initialValue,
  onValueChange,
  label,
  ...editableProps
}: EditorProps) => {
  const renderElement = useCallback(
    (props: ElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    [],
  );
  const [editorFocused, setEditorFocused] = useState(false);

  const handleHotkeys = (event: KeyboardEvent<HTMLDivElement>) =>
    Object.entries(HOTKEYS).forEach(([mark, hotkey]) => {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();

        if (isBlockFormat(mark as Format)) {
          toggleBlock(editor, mark as Format);
        } else if (isColorFormat(mark)) {
          toggleMark(editor, FORMATS.COLOR, mark);
        } else {
          toggleMark(editor, mark as Format);
        }
      }
    });

  return (
    <div className="pt-8 relative">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onValueChange={onValueChange}
      >
        {editorFocused && <EditorToolbar />}
        {!editorFocused && (
          <div className="absolute top-0 left-0">
            <span className="ml-1 label-text">{label}</span>
          </div>
        )}
        <Editable
          className={classNames(
            "textarea textarea-bordered border-primary",
            className,
          )}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onFocus={() => setEditorFocused(true)}
          onBlur={() => setEditorFocused(false)}
          onKeyDown={handleHotkeys}
          {...editableProps}
        />
      </Slate>
    </div>
  );
};
