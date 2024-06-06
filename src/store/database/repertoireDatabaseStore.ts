import { getObject, upsertObject } from "local-storage-superjson";
import { isEqual } from "lodash";
import { RepertoireMove, RepertoirePositionData } from "@/defs.ts";

const subscribers = new Set<() => void>();

const notifySubscribers = () => subscribers.forEach((callback) => callback());
const DEFAULT_POSITION_DATA = { moves: [] };
let currentPositionData: RepertoirePositionData = DEFAULT_POSITION_DATA;

export const repertoireDatabaseStore = {
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  getSnapshot: (fen: string): RepertoirePositionData => {
    const positionData =
      getObject<RepertoirePositionData>(fen) ?? DEFAULT_POSITION_DATA;

    if (isEqual(positionData, currentPositionData)) {
      return currentPositionData;
    }

    currentPositionData = positionData;
    return positionData;
  },
  upsertMove: (fen: string, repertoireMove: RepertoireMove) => {
    upsertObject<RepertoirePositionData>(
      fen,
      { moves: [repertoireMove] },
      (data: RepertoirePositionData) => {
        const { moves } = data;

        if (!moves) {
          return { ...data, moves: [repertoireMove] };
        }

        const existingMove = moves.find((m) => m.san === repertoireMove.san);

        if (existingMove) {
          return {
            ...data,
            moves: moves.map((move) =>
              move.san === repertoireMove.san
                ? {
                    ...move,
                    ...repertoireMove,
                  }
                : move,
            ),
          };
        }

        return {
          ...data,
          moves: [...moves, repertoireMove],
        };
      },
    );
    notifySubscribers();
  },
  upsertComment: (fen: string, comment: string) => {
    upsertObject<RepertoirePositionData>(
      fen,
      { ...DEFAULT_POSITION_DATA, comment },
      (data) => ({
        ...data,
        comment,
      }),
    );
    notifySubscribers();
  },
};
