import { RenderLeafProps } from "slate-react/dist/components/editable";
import { Text } from "slate";
import { Format, FORMATS } from "./defs.ts";
import classNames from "classnames";

export interface LeafProps extends Partial<RenderLeafProps> {
  leaf?: Text & Partial<Record<Format, string>>;
}

export const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  if (!leaf) return null;

  if (leaf[FORMATS.BOLD]) {
    children = <strong>{children}</strong>;
  }

  if (leaf[FORMATS.CODE]) {
    children = <code>{children}</code>;
  }

  if (leaf[FORMATS.ITALIC]) {
    children = <em>{children}</em>;
  }

  if (leaf[FORMATS.UNDERLINE]) {
    children = <u>{children}</u>;
  }

  return (
    <span
      className={classNames({
        "font-chess": leaf[FORMATS.CHESS],
      })}
      style={{ color: leaf[FORMATS.COLOR] }}
      {...attributes}
    >
      {children}
    </span>
  );
};
