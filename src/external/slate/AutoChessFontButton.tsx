import { LuWandSparkles } from "react-icons/lu";
import { useSlateStatic } from "slate-react";
import { EditorButton } from "./EditorButton.tsx";
import { formatChessNotation } from "./formatChessNotation.ts";

export const AutoChessFontButton = ({ className }: { className?: string }) => {
  const editor = useSlateStatic();

  return (
    <EditorButton
      active={false}
      className={className}
      title="Auto-format chess notation in the entire comment"
      aria-label="Auto-format chess notation"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => formatChessNotation(editor)}
    >
      <LuWandSparkles aria-hidden="true" />
    </EditorButton>
  );
};
