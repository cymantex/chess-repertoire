import { ReactNode } from "react";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";

export const withOptionalTooltip = (
  children: ReactNode,
  tooltip?: ReactNode,
) => (tooltip ? <Tooltip tooltip={tooltip}>{children}</Tooltip> : children);
