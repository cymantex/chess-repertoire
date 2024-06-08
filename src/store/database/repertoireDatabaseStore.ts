import { getObject, upsertObject } from "local-storage-superjson";
import { isEqual } from "lodash";
import {
  DEFAULT_POSITION_DATA,
  DEFAULT_SETTINGS,
  PRIORITY_SETTING,
  RepertoireMove,
  RepertoireMovePriority,
  RepertoirePositionData,
  RepertoireSettings,
  SETTINGS_KEY,
} from "@/defs.ts";

const subscribers = new Set<() => void>();

const notifySubscribers = () => subscribers.forEach((callback) => callback());
let currentPositionData: RepertoirePositionData = DEFAULT_POSITION_DATA;
let currentSettings: RepertoireSettings = DEFAULT_SETTINGS;

export const repertoireDatabaseStore = {
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  getRepertoireSettingsSnapshot: (): RepertoireSettings => {
    const settings = getRepertoireSettings();

    if (isEqual(settings, currentSettings)) {
      return currentSettings;
    }

    currentSettings = settings;
    return settings;
  },
  getPositionDataSnapshot: (fen: string): RepertoirePositionData => {
    const positionData = getPositionData(fen) ?? DEFAULT_POSITION_DATA;

    if (isEqual(positionData, currentPositionData)) {
      return currentPositionData;
    }

    currentPositionData = positionData;
    return positionData;
  },
  upsertSettings: (settings: RepertoireSettings) => {
    upsertRepertoireSettings(settings);
    notifySubscribers();
  },
  deleteMove: (fen: string, san: string) => {
    deleteMove(fen, san);
    notifySubscribers();
  },
  upsertMove: (
    fen: string,
    repertoireMove: RepertoireMove,
    respectPrioritySettings = true,
  ) => {
    upsertRepertoireMove(fen, repertoireMove, respectPrioritySettings);
    notifySubscribers();
  },
  upsertComment: (fen: string, comment: string) => {
    upsertRepertoireComment(fen, comment);
    notifySubscribers();
  },
};

export const getPositionData = (fen: string) =>
  getObject<RepertoirePositionData>(fen);

const getRepertoireSettings = () =>
  getObject<RepertoireSettings>(SETTINGS_KEY) ?? DEFAULT_SETTINGS;

const deleteMove = (fen: string, san: string) => {
  upsertObject<RepertoirePositionData>(
    fen,
    DEFAULT_POSITION_DATA,
    (data: RepertoirePositionData) => ({
      ...data,
      moves: data.moves?.filter((move) => move.san !== san),
    }),
  );
};

function upsertRepertoireSettings(settings: RepertoireSettings) {
  upsertObject<RepertoireSettings>(
    SETTINGS_KEY,
    { ...DEFAULT_SETTINGS, ...settings },
    (existingSettings) => ({
      ...existingSettings,
      ...settings,
    }),
  );
}

const upsertRepertoireMove = (
  fen: string,
  repertoireMove: RepertoireMove,
  respectPrioritySettings = true,
) => {
  const { prioritySetting } = getRepertoireSettings();

  if (
    respectPrioritySettings &&
    prioritySetting === PRIORITY_SETTING.DONT_SAVE
  ) {
    return;
  }

  const withSelectedAutomaticPriority = (move: RepertoireMove) => {
    if (
      respectPrioritySettings &&
      prioritySetting === PRIORITY_SETTING.NO_PRIORITY
    ) {
      return move;
    }

    return {
      priority: prioritySetting as RepertoireMovePriority,
      ...move,
    };
  };

  upsertObject<RepertoirePositionData>(
    fen,
    { moves: [withSelectedAutomaticPriority(repertoireMove)] },
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
        moves: [...moves, withSelectedAutomaticPriority(repertoireMove)],
      };
    },
  );
};

const upsertRepertoireComment = (fen: string, comment: string) => {
  upsertObject<RepertoirePositionData>(
    fen,
    { ...DEFAULT_POSITION_DATA, comment },
    (data) => ({
      ...data,
      comment,
    }),
  );
};
