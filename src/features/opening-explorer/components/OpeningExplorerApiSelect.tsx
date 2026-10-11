import classNames from "classnames";
import {
  repertoireSettingsStore,
  useRepertoireSettings,
} from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { FaBook, FaChevronDown, FaDatabase } from "react-icons/fa";
import { SiLichess } from "react-icons/si";
import { OPENING_EXPLORER_API } from "@/features/opening-explorer/defs.ts";
import { ThMenu } from "@/common/components/ThMenu/ThMenu.tsx";
import { Popover } from "@/common/components/Popover.tsx";

const databases = [
  {
    value: OPENING_EXPLORER_API.MASTERS,
    label: "Masters",
    description: "Master games",
    Icon: FaBook,
  },
  {
    value: OPENING_EXPLORER_API.LICHESS,
    label: "Lichess",
    description: "Online games",
    Icon: SiLichess,
  },
  {
    value: OPENING_EXPLORER_API.NONE,
    label: "Repertoire",
    description: "Saved moves",
    Icon: FaDatabase,
  },
];

export const OpeningExplorerApiSelect = () => {
  const { openingExplorerApi } = useRepertoireSettings();
  const { label, Icon } =
    databases.find(({ value }) => value === openingExplorerApi) ?? databases[2];

  return (
    <Popover
      renderTrigger={(triggerProps) => (
        <ThMenu.IconButton
          {...triggerProps}
          title={`${label} database`}
          aria-label={`Change game database (${label} selected)`}
          className="flex items-center gap-1"
        >
          <Icon aria-hidden="true" />
          <FaChevronDown aria-hidden="true" className="text-[8px]" />
        </ThMenu.IconButton>
      )}
    >
      {(close) => (
        <fieldset>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-base-200 p-1">
            {databases.map(({ value, label, description, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={openingExplorerApi === value}
                onClick={() => {
                  repertoireSettingsStore.upsertSettings({
                    openingExplorerApi: value,
                  });
                  close();
                }}
                className={classNames(
                  "flex min-w-0 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  openingExplorerApi === value
                    ? "border-accent bg-accent text-accent-content"
                    : "border-transparent text-base-content/70 hover:bg-base-300",
                )}
              >
                <span className="flex items-center gap-1 text-xs font-semibold">
                  <Icon aria-hidden="true" className="shrink-0" />
                  {label}
                </span>
                <span className="text-[10px]">{description}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </Popover>
  );
};
