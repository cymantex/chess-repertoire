import { useFocused, useSelected } from "slate-react";

import { ElementProps } from "../defs.ts";

export const ImageElement = ({
  attributes,
  children,
  element,
}: ElementProps) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false}>
        <img
          alt={element.url}
          src={element.url}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "20em",
            boxShadow:
              selected && focused ? "0 0 0 1px oklch(var(--inc))" : "none",
          }}
        />
      </div>
    </div>
  );
};
