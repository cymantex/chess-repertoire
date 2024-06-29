import { ElementProps } from "./defs.ts";
import { Image } from "./image/Image.tsx";

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
    case "bulleted-list":
      return (
        <ul className="list-disc" style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 className="text-xl" style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 className="text-lg" style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol className="list-decimal" style={style} {...attributes}>
          {children}
        </ol>
      );
    case "paragraph":
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    case "image":
      return <Image {...props} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
