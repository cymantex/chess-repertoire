import { ElementProps, FORMATS } from "./defs.ts";
import { ImageElement } from "./image/ImageElement.tsx";

export const Element = (props: ElementProps) => {
  const { attributes, children, element } = props;
  if (!element) return null;

  const style = { textAlign: element.align };

  if (!element.type)
    return (
      <p style={style} {...attributes}>
        {children}
      </p>
    );

  switch (element.type) {
    case FORMATS.BULLETED_LIST:
      return (
        <ul className="list-disc" style={style} {...attributes}>
          {children}
        </ul>
      );
    case FORMATS.HEADING_ONE:
      return (
        <h1 className="text-2xl" style={style} {...attributes}>
          {children}
        </h1>
      );
    case FORMATS.HEADING_TWO:
      return (
        <h2 className="text-lg" style={style} {...attributes}>
          {children}
        </h2>
      );
    case FORMATS.LIST_ITEM:
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case FORMATS.NUMBERED_LIST:
      return (
        <ol className="list-decimal" style={style} {...attributes}>
          {children}
        </ol>
      );
    case FORMATS.PARAGRAPH:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    case FORMATS.IMAGE:
      return <ImageElement {...props} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
