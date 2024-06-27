import { ReactNode } from "react";
import "./Tooltip.scss";

interface TooltipProps {
  tooltip: ReactNode;
  children: ReactNode;
}

export const Tooltip = ({ tooltip, children }: TooltipProps) => {
  return (
    <div className="repertoire-tooltip">
      <div className="repertoire-tooltip__content border border-primary">
        {tooltip}
      </div>
      <div className="repertoire-tooltip__body">{children}</div>
    </div>
  );
};
