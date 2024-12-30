import {
  prettifyLargeNumber,
  shortenLargeNumber,
} from "@/features/opening-explorer/utils.ts";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";

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
