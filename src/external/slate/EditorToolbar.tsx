import { MarkButton } from "./MarkButton.tsx";
import { FORMATS, HOTKEYS } from "./defs.ts";
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
import { BlockButton } from "./BlockButton.tsx";

const EDITOR_BUTTON_CLASS_NAME = "p-1 border border-primary";

export const EditorToolbar = () => (
  <div className="absolute top-0 left-0 flex items-center gap-2">
    <MarkButton
      title={`Chess font (${HOTKEYS[FORMATS.CHESS]})`}
      className="pt-1 pb-1 pr-1 pl-1 border border-primary"
      format={FORMATS.CHESS}
      icon={<div className="leading-none font-chess">N</div>}
    />
    <MarkButton
      title={`Bold (${HOTKEYS[FORMATS.BOLD]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.BOLD}
      icon={<LuBold />}
    />
    <MarkButton
      title={`Italic (${HOTKEYS[FORMATS.ITALIC]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.ITALIC}
      icon={<LuItalic />}
    />
    <MarkButton
      title={`Underline (${HOTKEYS[FORMATS.UNDERLINE]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.UNDERLINE}
      icon={<LuUnderline />}
    />
    <MarkButton
      title={`Code (${HOTKEYS[FORMATS.CODE]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.CODE}
      icon={<LuCode />}
    />
    <BlockButton
      title={`Heading 1 (${HOTKEYS[FORMATS.HEADING_ONE]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.HEADING_ONE}
      icon={<LuHeading1 />}
    />
    <BlockButton
      title={`Heading 2 (${HOTKEYS[FORMATS.HEADING_TWO]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.HEADING_TWO}
      icon={<LuHeading2 />}
    />
    <BlockButton
      title={`Numbered list (${HOTKEYS[FORMATS.NUMBERED_LIST]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.NUMBERED_LIST}
      icon={<LuListOrdered />}
    />
    <BlockButton
      title={`Bulleted list (${HOTKEYS[FORMATS.BULLETED_LIST]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.BULLETED_LIST}
      icon={<LuList />}
    />
    <BlockButton
      title={`Align left (${HOTKEYS[FORMATS.LEFT]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.LEFT}
      icon={<LuAlignLeft />}
    />
    <BlockButton
      title={`Center (${HOTKEYS[FORMATS.CENTER]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.CENTER}
      icon={<LuAlignCenter />}
    />
    <BlockButton
      title={`Align right (${HOTKEYS[FORMATS.RIGHT]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.RIGHT}
      icon={<LuAlignRight />}
    />
    <BlockButton
      title={`Justify (${HOTKEYS[FORMATS.JUSTIFY]})`}
      className={EDITOR_BUTTON_CLASS_NAME}
      format={FORMATS.JUSTIFY}
      icon={<LuAlignJustify />}
    />
  </div>
);
