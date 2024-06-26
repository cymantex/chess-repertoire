import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { useCallback, useMemo } from "react";
import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuCode,
  LuHeading1,
  LuHeading2,
  LuItalic,
  LuList,
  LuListOrdered,
  LuUnderline,
} from "react-icons/lu";
import { Element, ElementProps } from "@/external/slate/components/Element.tsx";
import { Leaf, LeafProps } from "@/external/slate/components/Leaf.tsx";
import { BlockButton } from "@/external/slate/components/BlockButton.tsx";
import { MarkButton } from "@/external/slate/components/MarkButton.tsx";
import { FORMATS } from "@/external/slate/components/defs.ts";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";
import { FaChessKnight } from "react-icons/fa";

interface CommentRichTextEditorProps {
  fen: string;
  positionComment: string;
}

export const CommentRichTextEditor = ({
  fen,
  positionComment,
}: CommentRichTextEditorProps) => {
  console.log(fen);

  const renderElement = useCallback(
    (props: ElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // TODO: Noto Chess font!
  return (
    <HideOnMobile className=" mt-2">
      <Slate
        editor={editor}
        initialValue={[
          {
            children: [{ text: positionComment }],
          },
        ]}
      >
        <div className="flex items-center gap-2 mb-2">
          <MarkButton format={FORMATS.CHESS} icon={<FaChessKnight />} />
          <MarkButton format={FORMATS.BOLD} icon={<LuBold />} />
          <MarkButton format={FORMATS.ITALIC} icon={<LuItalic />} />
          <MarkButton format={FORMATS.UNDERLINE} icon={<LuUnderline />} />
          <MarkButton format={FORMATS.CODE} icon={<LuCode />} />
          <BlockButton format={FORMATS.HEADING_ONE} icon={<LuHeading1 />} />
          <BlockButton format={FORMATS.HEADING_TWO} icon={<LuHeading2 />} />
          <BlockButton format={FORMATS.NUMBERED_LIST} icon={<LuList />} />
          <BlockButton
            format={FORMATS.BULLETED_LIST}
            icon={<LuListOrdered />}
          />
          <BlockButton format={FORMATS.LEFT} icon={<LuAlignLeft />} />
          <BlockButton format={FORMATS.CENTER} icon={<LuAlignCenter />} />
          <BlockButton format={FORMATS.RIGHT} icon={<LuAlignRight />} />
          <BlockButton format={FORMATS.JUSTIFY} icon={<LuAlignJustify />} />
        </div>
        <Editable
          className="textarea textarea-bordered"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          autoFocus
          rows={5}
        />
      </Slate>
    </HideOnMobile>
  );
};
