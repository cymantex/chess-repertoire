import classNames from "classnames";
import { WhiteKing } from "@/external/chessground/components/WhiteKing.tsx";
import { WhiteQueen } from "@/external/chessground/components/WhiteQueen.tsx";
import { useState } from "react";
import { WhiteRook } from "@/external/chessground/components/WhiteRook.tsx";
import { WhiteBishop } from "@/external/chessground/components/WhiteBishop.tsx";
import { WhitePawn } from "@/external/chessground/components/WhitePawn.tsx";
import { FaBan, FaChessBoard } from "react-icons/fa6";
import { useRepertoireSettings } from "@/store/database/hooks.ts";
import { PRIORITY_SETTING, PrioritySetting } from "@/defs.ts";
import { localStorageStore } from "@/store/database/localStorageStore.ts";

const getPrioritySettingIcon = (prioritySetting: PrioritySetting) => {
  switch (prioritySetting) {
    case PRIORITY_SETTING.KING:
      return {
        SettingsIcon: WhiteKing,
        displayName: "King",
      };
    case PRIORITY_SETTING.QUEEN:
      return {
        SettingsIcon: WhiteQueen,
        displayName: "Queen",
      };
    case PRIORITY_SETTING.ROOK:
      return {
        SettingsIcon: WhiteRook,
        displayName: "Rook",
      };
    case PRIORITY_SETTING.BISHOP:
      return {
        SettingsIcon: WhiteBishop,
        displayName: "Bishop",
      };
    case PRIORITY_SETTING.PAWN:
      return {
        SettingsIcon: WhitePawn,
        displayName: "Pawn",
      };
    case PRIORITY_SETTING.NO_PRIORITY:
      return {
        SettingsIcon: FaChessBoard,
        displayName: "No priority",
      };
    case PRIORITY_SETTING.DONT_SAVE:
      return {
        SettingsIcon: FaBan,
        displayName: "Don't save played moves",
      };
    default:
      throw new Error(`Unknown priority setting: ${prioritySetting}`);
  }
};

export const PrioritySettings = () => {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const { prioritySetting } = useRepertoireSettings();

  const { SettingsIcon } = getPrioritySettingIcon(prioritySetting);

  return (
    <div
      className={classNames("dropdown md:dropdown-top", {
        "dropdown-open": showPriorityMenu,
      })}
    >
      <span
        title="Priority settings"
        onClick={() => setShowPriorityMenu(!showPriorityMenu)}
      >
        <SettingsIcon className="transition-all hover:scale-150 rounded cursor-pointer" />
      </span>
      <div
        className={classNames(
          "dropdown-content p-2 bg-base-100 rounded-box w-64",
          {
            hidden: !showPriorityMenu,
          },
        )}
      >
        <div role="alert" className="alert shadow-lg mb-2">
          <div>
            <h3 className="font-bold text-base">Priority settings</h3>
            <div className="text-xs">
              Here you can change how new moves should be prioritized in your
              repertoire.
            </div>
          </div>
        </div>
        <ul className="menu p-0">
          {Object.values(PRIORITY_SETTING).map((prioritySetting) => (
            <PrioritySettingMenuItem
              key={prioritySetting}
              prioritySetting={prioritySetting}
              onClick={() => {
                localStorageStore.upsertSettings({
                  prioritySetting,
                });
                setShowPriorityMenu(false);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const PrioritySettingMenuItem = ({
  prioritySetting,
  onClick,
}: {
  prioritySetting: PrioritySetting;
  onClick: () => void;
}) => {
  const { SettingsIcon, displayName } = getPrioritySettingIcon(prioritySetting);

  return (
    <li>
      <a className="pl-1" onClick={() => onClick()}>
        <SettingsIcon className="text-2xl" /> {displayName}
      </a>
    </li>
  );
};
