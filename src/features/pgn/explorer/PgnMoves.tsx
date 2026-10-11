import type { ReactNode } from "react";
import type { ChildNode } from "chessops/pgn";
import type { RenderPgnNodeData } from "@/external/chessops/defs.ts";
import { GoToMoveButton } from "@/common/components/GoToMoveButton.tsx";
import { PgnInlineVariation } from "./PgnInlineVariation.tsx";

type MoveNode = ChildNode<RenderPgnNodeData>;

interface Props {
  nodes: MoveNode[];
  initialPly: number;
  disabled: boolean;
  isSelectedMove: (path: string[]) => boolean;
  contextMenuPath?: string;
}

const canInlineVariation = (variations: MoveNode[]) => {
  if (variations.length !== 1) return false;

  let node: MoveNode | undefined = variations[0];
  for (let length = 0; node; length++, node = node.children[0]) {
    if (length >= 6 || node.children.length > 1) return false;
  }
  return true;
};

export const PgnMoves = ({
  nodes,
  initialPly,
  disabled,
  isSelectedMove,
  contextMenuPath,
}: Props) => {
  const renderBranches = (nodes: MoveNode[], path: string[], ply: number) => (
    <ul className="pgn-branches" key={`${path.join(" ")}-branches`}>
      {nodes.map((node) => (
        <li className="pgn-line" key={node.data.san}>
          {renderLine([node], path, ply, false)}
        </li>
      ))}
    </ul>
  );

  const renderLine = (
    nodes: MoveNode[],
    path: string[],
    ply: number,
    isMainline: boolean,
  ): ReactNode[] => {
    const result: ReactNode[] = [];
    let forceMoveNumber = true;

    while (nodes.length) {
      const [node, ...siblings] = nodes;
      const inlineVariation = canInlineVariation(siblings);

      if (!isMainline && siblings.length && !inlineVariation) {
        result.push(renderBranches(nodes, path, ply));
        break;
      }

      const movePath = [...path, node.data.san];
      const movePathKey = movePath.join(" ");
      const contextMenuOpen = contextMenuPath === movePathKey;
      const move = {
        ...node.data,
        moveNumber:
          forceMoveNumber || ply % 2 === 0
            ? `${Math.floor(ply / 2) + 1}${ply % 2 ? "..." : "."}`
            : undefined,
      };

      result.push(
        <div
          className={`pgn-move${contextMenuOpen ? " pgn-menu-target" : ""}`}
          data-pgn-path={movePathKey}
          key={movePathKey}
        >
          <GoToMoveButton
            disabled={disabled}
            italic={!isMainline}
            selected={isSelectedMove(movePath)}
            contextMenuOpen={contextMenuOpen}
            move={move}
            getVariation={() => movePath}
          />
        </div>,
      );

      if (siblings.length) {
        result.push(
          inlineVariation ? (
            <PgnInlineVariation key={`${movePathKey}-variation`}>
              {renderLine(siblings, path, ply, false)}
            </PgnInlineVariation>
          ) : (
            renderBranches(siblings, path, ply)
          ),
        );
      }

      forceMoveNumber = siblings.length > 0;
      nodes = node.children;
      path = movePath;
      ply++;
    }

    return result;
  };

  return <>{renderLine(nodes, [], initialPly, true)}</>;
};
