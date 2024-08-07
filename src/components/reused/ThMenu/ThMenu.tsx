import { ReactNode } from "react";
import "./ThMenu.scss";
import {
  IconButton,
  IconButtonProps,
} from "@/components/reused/IconButton.tsx";
import classNames from "classnames";

import { withOptionalTooltip } from "@/components/reused/Tooltip/withOptionalTooltip.tsx";

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

ThMenu.IconButton = ({
  title,
  className,
  children,
  ...props
}: IconButtonProps) =>
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
