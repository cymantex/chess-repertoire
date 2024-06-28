// @refresh reset
import { createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { useCallback, useMemo } from "react";
import { Element, ElementProps } from "./Element.tsx";
import { Leaf, LeafProps } from "./Leaf.tsx";
import { EditorToolbar } from "@/external/slate/EditorToolbar.tsx";

interface EditorProps {
  initialValue: Descendant[];
  onValueChange: (value: Descendant[]) => void;
  placeholder?: string;
}

export const Editor = ({
  initialValue,
  onValueChange,
  placeholder,
}: EditorProps) => {
  const renderElement = useCallback(
    (props: ElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  console.log(editor);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onValueChange={onValueChange}
    >
      <EditorToolbar />
      <Editable
        className="textarea textarea-bordered"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
      />
    </Slate>
  );
};
