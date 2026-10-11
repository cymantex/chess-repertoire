import type { KeyboardEvent, MouseEvent } from "react";
import { useCallback, useState } from "react";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import type { PgnMenuTarget } from "./PgnContextMenu.tsx";

export const usePgnContextMenu = (initialPly: number, disabled: boolean) => {
  const [menuTarget, setMenuTarget] = useState<PgnMenuTarget | null>(null);
  const closeMenu = useCallback(
    (restoreFocus = true) => {
      setMenuTarget(null);
      if (restoreFocus) menuTarget?.trigger.focus();
    },
    [menuTarget],
  );

  const openMenu = (event: MouseEvent | KeyboardEvent) => {
    if (disabled) return;
    const element = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-pgn-path]",
    );
    const trigger = element?.querySelector<HTMLButtonElement>("button");
    if (!element || !trigger) return;

    event.preventDefault();
    event.stopPropagation();
    const path = element.dataset.pgnPath!.split(" ");
    const ply = initialPly + path.length - 1;
    const rect = trigger.getBoundingClientRect();
    const pointer =
      "clientX" in event && (event.clientX || event.clientY) ? event : null;
    setMenuTarget({
      path,
      label: `${Math.floor(ply / 2) + 1}${ply % 2 ? "..." : "."} ${path.at(-1)}`,
      x: pointer?.clientX ?? rect.left,
      y: pointer?.clientY ?? rect.bottom,
      trigger,
      pgn: useRepertoireStore.getState().pgn,
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === "ContextMenu" ||
      (event.shiftKey && event.key === "F10")
    ) {
      openMenu(event);
    }
  };

  return { menuTarget, openMenu, closeMenu, handleKeyDown };
};
