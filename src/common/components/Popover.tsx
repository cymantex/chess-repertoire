import type { MouseEventHandler, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

interface Props {
  renderTrigger: (props: {
    popoverTarget: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }) => ReactNode;
  children: (close: () => void) => ReactNode;
}

export const Popover = ({ renderTrigger, children }: Props) => {
  const id = useId();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const close = () => popoverRef.current?.hidePopover();

  useEffect(() => {
    if (!open) return;

    const dismiss = (event: Event) => {
      if (event.target !== popoverRef.current)
        popoverRef.current?.hidePopover();
    };
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  return (
    <>
      {renderTrigger({
        popoverTarget: id,
        onClick: (event) => {
          const popover = popoverRef.current;
          if (!popover) return;

          const rect = event.currentTarget.getBoundingClientRect();
          const above = rect.top > window.innerHeight - rect.bottom;
          const space = above ? rect.top : window.innerHeight - rect.bottom;
          popover.style.left = `${Math.max(8, Math.min(rect.right - 320, window.innerWidth - 328))}px`;
          popover.style.top = `${above ? rect.top - 8 : rect.bottom + 8}px`;
          popover.style.transform = above ? "translateY(-100%)" : "none";
          popover.style.maxHeight = `${Math.max(0, space - 16)}px`;
        },
      })}
      <div
        ref={popoverRef}
        id={id}
        popover="auto"
        onToggle={(event) => setOpen(event.newState === "open")}
        onKeyDown={(event) => event.stopPropagation()}
        className="fixed inset-auto m-0 w-80 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-lg border border-primary bg-base-100 p-3 text-base-content shadow-xl"
      >
        {children(close)}
      </div>
    </>
  );
};
