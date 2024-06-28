import { MarkButton } from "@/external/slate/MarkButton.tsx";
import { FORMATS } from "@/external/slate/defs.ts";
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
import { BlockButton } from "@/external/slate/BlockButton.tsx";

const EDITOR_BUTTON_CLASS_NAME = "p-1 border border-primary";

export const EditorToolbar = () => (
  <div className="flex items-center mb-2 gap-2">
    <MarkButton
      className="pt-1 pb-1 pr-1 pl-1 border border-primary"
      format={FORMATS.CHESS}
      icon={<div className="leading-none font-chess">N</div>}
    />
    <MarkButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.BOLD}
      icon={<LuBold />}
    />
    <MarkButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.ITALIC}
      icon={<LuItalic />}
    />
    <MarkButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.UNDERLINE}
      icon={<LuUnderline />}
    />
    <MarkButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.CODE}
      icon={<LuCode />}
    />
    <BlockButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.HEADING_ONE}
      icon={<LuHeading1 />}
    />
    <BlockButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.HEADING_TWO}
      icon={<LuHeading2 />}
    />
    <BlockButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.NUMBERED_LIST}
      icon={<LuList />}
    />
    <BlockButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.BULLETED_LIST}
      icon={<LuListOrdered />}
    />
    <BlockButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.LEFT}
      icon={<LuAlignLeft />}
    />
    <BlockButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.CENTER}
      icon={<LuAlignCenter />}
    />
    <BlockButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.RIGHT}
      icon={<LuAlignRight />}
    />
    <BlockButton
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.JUSTIFY}
      icon={<LuAlignJustify />}
    />
  </div>
);
