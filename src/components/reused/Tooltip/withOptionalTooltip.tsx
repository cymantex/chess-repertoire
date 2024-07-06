import { ReactNode } from "react";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";

export const withOptionalTooltip = (
  children: ReactNode,
  tooltip?: ReactNode,
) => (tooltip ? <Tooltip tooltip={tooltip}>{children}</Tooltip> : children);