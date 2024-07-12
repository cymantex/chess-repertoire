import {
  prettifyLargeNumber,
  shortenLargeNumber,
} from "@/components/RepertoireSidebar/OpeningExplorer/utils.ts";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";

export const LargeNumber = ({ num }: { num: number }) => {
  const shortened = shortenLargeNumber(num);
  return (
    <Tooltip
      containerClassName="inline-block"
      renderTooltip={() => prettifyLargeNumber(num)}
    >
      <span>{shortened}</span>
    </Tooltip>
  );
};
