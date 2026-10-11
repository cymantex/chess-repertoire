import type { ChildNode, Game, PgnNodeData } from "chessops/pgn";
import {
  Box,
  Node,
  extend,
  makePgn,
  startingPosition,
  transform,
} from "chessops/pgn";
import { makeSan, parseSan } from "chessops/san";

export type PgnMoveAction = "promote" | "mainline" | "delete";

export const getPgnPath = (pgn: Game<PgnNodeData>, path: string[]) => {
  const nodes: ChildNode<PgnNodeData>[] = [];
  const position = startingPosition(pgn.headers).unwrap();
  let parent = pgn.moves;

  for (const san of path) {
    const node = parent.children.find((child) => {
      if (child.data.san === san) return true;
      const move = parseSan(position, child.data.san);
      return move && makeSan(position, move) === san;
    });
    const move = node && parseSan(position, node.data.san);
    if (!node || !move) throw new Error("This PGN move is no longer available");

    nodes.push(node);
    position.play(move);
    parent = node;
  }

  return nodes;
};

export const updatePgnTree = (
  pgn: Game<PgnNodeData>,
  path: string[],
  action: PgnMoveAction,
) => {
  if (!path.length) throw new Error("Select a PGN move first");

  const updated = {
    ...pgn,
    moves: transform(pgn.moves, new Box(null), (_, data) => data),
  };
  const nodes = getPgnPath(updated, path);

  for (let i = nodes.length - 1; i >= 0; i--) {
    const parent = nodes[i - 1] ?? updated.moves;
    const index = parent.children.indexOf(nodes[i]);

    if (action === "delete") {
      parent.children.splice(index, 1);
      break;
    }

    if (index > 0) {
      const [node] = parent.children.splice(index, 1);
      parent.children.unshift(node);
      if (action === "promote") break;
    }
  }

  return updated;
};

export const makePgnLine = (pgn: Game<PgnNodeData>, path: string[]) => {
  const nodes = getPgnPath(pgn, path);
  const mainline = nodes.every(
    (node, i) => (nodes[i - 1] ?? pgn.moves).children[0] === node,
  );
  const moves = new Node<PgnNodeData>();
  const end = extend(
    moves,
    nodes.map((node) => node.data),
  );
  const source = nodes.at(-1) ?? pgn.moves;

  if (mainline) {
    extend(end, Array.from(source.mainline()));
  } else {
    end.children = source.children;
  }

  return makePgn({
    ...pgn,
    headers: new Map([...pgn.headers, ["Result", "*"]]),
    moves,
  });
};
