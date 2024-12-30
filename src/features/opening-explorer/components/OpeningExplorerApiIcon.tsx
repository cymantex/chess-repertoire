import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";
import { FaBook, FaDatabase } from "react-icons/fa";
import { SiLichess } from "react-icons/si";
import { OPENING_EXPLORER_API } from "@/features/opening-explorer/defs.ts";

export const OpeningExplorerApiIcon = () => {
  const { openingExplorerApi } = useRepertoireSettings();

  if (openingExplorerApi === OPENING_EXPLORER_API.MASTERS) {
    return (
      <Tooltip className="max-w-min" tooltip="Masters database">
        <FaBook />
      </Tooltip>
    );
  } else if (openingExplorerApi === OPENING_EXPLORER_API.LICHESS) {
    return (
      <Tooltip className="max-w-min" tooltip="Lichess database">
        <SiLichess />
      </Tooltip>
    );
  }

  return (
    <Tooltip className="max-w-min" tooltip="Repertoire database">
      <FaDatabase />
    </Tooltip>
  );
};
