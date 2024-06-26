import { ChildNode, Game, PgnNodeData } from "chessops/pgn";

const enum MakePgnState {
  Pre = 0,
  Sidelines = 1,
  End = 2,
}

interface MakePgnFrame {
  state: MakePgnState;
  ply: number;
  node: ChildNode<PgnNodeData>;
  sidelines: Iterator<ChildNode<PgnNodeData>>;
  inVariation: boolean;
}

export const PGN_TOKEN_TYPES = {
  MOVE: "MOVE",
  START_VARIATION: "START_VARIATION",
  END_VARIATION: "END_VARIATION",
} as const;

type PgnTokenType = (typeof PGN_TOKEN_TYPES)[keyof typeof PGN_TOKEN_TYPES];

interface PgnToken<T extends PgnNodeData> {
  type: PgnTokenType;
  value: string | T;
}

/**
 * A stripped down version of chessops makePgn to help render a "PGN" where the
 * moves should be interactable.
 */
export const makePgnMoveTokens = <T extends PgnNodeData>(
  game: Game<T>,
): PgnToken<T>[] => {
  const tokens: PgnToken<T>[] = [];
  const stack: MakePgnFrame[] = [];

  const addToken = (token: PgnToken<T>) => tokens.push(token);

  if (game.moves.children.length) {
    const variations = game.moves.children[Symbol.iterator]();
    stack.push({
      state: MakePgnState.Pre,
      ply: 0,
      node: variations.next().value,
      sidelines: variations,
      inVariation: false,
    });
  }

  let forceMoveNumber = true;
  while (stack.length) {
    const frame = stack[stack.length - 1];

    if (frame.inVariation) {
      addToken({ type: PGN_TOKEN_TYPES.END_VARIATION, value: ")" });
      frame.inVariation = false;
      forceMoveNumber = true;
    }

    switch (frame.state) {
      // @ts-ignore
      case MakePgnState.Pre:
        if (forceMoveNumber || frame.ply % 2 === 0) {
          addToken({
            type: PGN_TOKEN_TYPES.MOVE,
            value: {
              ...frame.node.data,
              moveNumber:
                Math.floor(frame.ply / 2) + 1 + (frame.ply % 2 ? "..." : "."),
            } as unknown as T,
          });
          forceMoveNumber = false;
        } else {
          addToken({ type: PGN_TOKEN_TYPES.MOVE, value: frame.node.data as T });
        }

        frame.state = MakePgnState.Sidelines; // fall through
      case MakePgnState.Sidelines: {
        const child = frame.sidelines.next();
        if (child.done) {
          if (frame.node.children.length) {
            const variations = frame.node.children[Symbol.iterator]();
            stack.push({
              state: MakePgnState.Pre,
              ply: frame.ply + 1,
              node: variations.next().value,
              sidelines: variations,
              inVariation: false,
            });
          }
          frame.state = MakePgnState.End;
        } else {
          addToken({ type: PGN_TOKEN_TYPES.START_VARIATION, value: "(" });
          forceMoveNumber = true;
          stack.push({
            state: MakePgnState.Pre,
            ply: frame.ply,
            node: child.value,
            sidelines: [][Symbol.iterator](),
            inVariation: false,
          });
          frame.inVariation = true;
        }
        break;
      }
      case MakePgnState.End:
        stack.pop();
    }
  }

  return tokens;
};
