import { RenderLeafProps } from "slate-react/dist/components/editable";
import { Text } from "slate";
import { Format } from "./defs.ts";

export interface LeafProps extends Partial<RenderLeafProps> {
  leaf?: Text & Partial<Record<Format, boolean>>;
}

export const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  if (!leaf) return null;

  if (leaf.chess) {
    children = <span className="font-chess">{children}</span>;
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
