import { KeyboardEvent } from "react";
import {
  BLOCK_FORMATS,
  BlockFormat,
  Format,
  LIST_FORMATS,
  ListFormat,
  TEXT_ALIGN_FORMATS,
  TextAlignFormat,
} from "@/external/slate/defs.ts";

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
