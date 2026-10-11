import type { KeyboardEvent } from "react";
import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Game, PgnNodeData } from "chessops/pgn";
import { FaArrowUp, FaCheck, FaCopy, FaTrash } from "react-icons/fa";
import { selectEditPgnMove, useRepertoireStore } from "@/app/zustand/store.ts";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import {
  openDefaultErrorToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import { getPgnPath, makePgnLine } from "./pgnActions.ts";

export interface PgnMenuTarget {
  pgn: Game<PgnNodeData>;
  path: string[];
  label: string;
  x: number;
  y: number;
  trigger: HTMLButtonElement;
}

interface Props {
  target: PgnMenuTarget;
  onClose: (restoreFocus?: boolean) => void;
}

export const PgnContextMenu = ({ target, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { pgn } = target;
  const editPgnMove = useRepertoireStore(selectEditPgnMove);
  const nodes = getPgnPath(pgn, target.path);
  const branchIndexes = nodes
    .map((node, i) => (nodes[i - 1] ?? pgn.moves).children.indexOf(node))
    .filter((index) => index > 0);
  const mainline = branchIndexes.length === 0;
  const canPromote = branchIndexes.length > 1 || branchIndexes[0] > 1;

  useLayoutEffect(() => {
    const menu = ref.current!;
    const margin = 4;
    menu.style.left = `${Math.max(margin, Math.min(target.x, window.innerWidth - menu.offsetWidth - margin))}px`;
    menu.style.top = `${Math.max(margin, Math.min(target.y, window.innerHeight - menu.offsetHeight - margin))}px`;
    menu.querySelector<HTMLButtonElement>("button")?.focus();

    const dismiss = () => onClose(false);
    const outside = (event: PointerEvent) => {
      if (!menu.contains(event.target as Node)) dismiss();
    };
    const scroll = (event: Event) => {
      if (!menu.contains(event.target as Node)) dismiss();
    };
    const currentPath = useRepertoireStore.getState().chess.history().join(" ");
    const unsubscribe = useRepertoireStore.subscribe((state) => {
      if (
        state.pgn !== pgn ||
        state.pendingPromotionMove ||
        state.chess.history().join(" ") !== currentPath
      )
        dismiss();
    });

    document.addEventListener("pointerdown", outside, true);
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("blur", dismiss);
    return () => {
      unsubscribe();
      document.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("blur", dismiss);
    };
  }, [target, pgn, onClose]);

  const run = async (action: () => void | Promise<void>) => {
    onClose();
    try {
      await action();
    } catch (error) {
      openDefaultErrorToast(error);
    }
  };

  const deleteFromHere = () => {
    const stack = [nodes[nodes.length - 1]];
    let moves = 0;
    let comments = 0;
    while (stack.length) {
      const node = stack.pop()!;
      moves++;
      comments +=
        (node.data.comments?.length ?? 0) +
        (node.data.startingComments?.length ?? 0);
      stack.push(...node.children);
    }

    if (moves < 10 && !comments) return editPgnMove(target.path, "delete");

    modalStore.addConfirmModal({
      children: `Delete ${moves} ${moves === 1 ? "move" : "moves"}${comments ? ` and ${comments} ${comments === 1 ? "comment" : "comments"}` : ""}?`,
      onConfirm: () =>
        void run(() => {
          if (useRepertoireStore.getState().pgn !== pgn) {
            throw new Error(
              "The PGN changed. Select the move again to delete it.",
            );
          }
          return editPgnMove(target.path, "delete");
        }),
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") event.preventDefault();
      onClose();
      return;
    }

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const buttons = Array.from(ref.current!.querySelectorAll("button"));
      const index = buttons.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? buttons.length - 1
            : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) %
              buttons.length;
      buttons[next]?.focus();
    }
  };

  return createPortal(
    <div
      ref={ref}
      id="pgn-context-menu"
      role="menu"
      aria-label={`Actions for ${target.label}`}
      className="pgn-context-menu menu bg-base-200 border border-primary rounded-box shadow-xl text-sm"
      onKeyDown={handleKeyDown}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="px-3 py-2 font-chess font-bold border-b border-base-content/20">
        {target.label}
      </div>
      {canPromote && (
        <button
          role="menuitem"
          tabIndex={-1}
          onClick={() => void run(() => editPgnMove(target.path, "promote"))}
        >
          <FaArrowUp aria-hidden /> Promote variation
        </button>
      )}
      {!mainline && (
        <button
          role="menuitem"
          tabIndex={-1}
          onClick={() => void run(() => editPgnMove(target.path, "mainline"))}
        >
          <FaCheck aria-hidden /> Make main line
        </button>
      )}
      <button
        role="menuitem"
        tabIndex={-1}
        onClick={() =>
          void run(async () => {
            await navigator.clipboard.writeText(makePgnLine(pgn, target.path));
            openSuccessToast("PGN copied to clipboard");
          })
        }
      >
        <FaCopy aria-hidden />{" "}
        {mainline ? "Copy main line PGN" : "Copy variation PGN"}
      </button>
      <button
        role="menuitem"
        tabIndex={-1}
        className="text-error"
        onClick={() => void run(deleteFromHere)}
      >
        <FaTrash aria-hidden /> Delete from here
      </button>
    </div>,
    document.body,
  );
};
