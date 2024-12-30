import { ReactNode } from "react";
import "./ThMenu.scss";
import { IconButton, Props } from "@/common/components/IconButton.tsx";
import classNames from "classnames";

import { withOptionalTooltip } from "@/common/components/Tooltip/withOptionalTooltip.tsx";

export const ThMenu = ({ children }: { children: ReactNode }) => {
  return <div className="th-menu flex">{children}</div>;
};

ThMenu.Container = ({ children }: { children: ReactNode }) => {
  return <div className="flex justify-between pr-6">{children}</div>;
};

ThMenu.Item = ({ children }: { children: ReactNode }) => {
  return (
    <div className="th-menu__item flex items-center gap-2">{children}</div>
  );
};

ThMenu.IconButton = ({ title, className, children, ...props }: Props) =>
  withOptionalTooltip(
    <IconButton
      className={classNames(
        "th-menu__icon-button text-base-content",
        className,
      )}
      {...props}
    >
      {children}
    </IconButton>,
    title,
  );
