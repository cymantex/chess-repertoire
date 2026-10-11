import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

export const PgnInlineVariation = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current!;
    const line = element.closest(".pgn-line")!;
    const update = () => {
      // Measure individual moves so wrapping cannot change the fit decision.
      const width = Array.from(element.children).reduce(
        (total, child) => total + child.getBoundingClientRect().width,
        0,
      );
      setExpanded(width > line.clientWidth);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(line);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      ref={ref}
      className={`pgn-inline${expanded ? " pgn-inline-expanded" : ""}`}
    >
      <span className="pgn-parenthesis">(</span>
      {children}
      <span className="pgn-parenthesis">)</span>
    </div>
  );
};
